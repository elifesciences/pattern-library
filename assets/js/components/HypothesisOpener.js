'use strict';
const utils = require('../libs/elife-utils')();
const SpeechBubble = require('./SpeechBubble');

module.exports = class HypothesisOpener {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.speechBubble = null;

    this.$elm.dataset.hypothesisTrigger = '';
    this.speechBubble = new SpeechBubble(this.findElementWithClass('speech-bubble'));
    this.isContextualData = utils.areElementsNested(this.doc.querySelector('.contextual-data'), this.$elm);

    if (!this.isContextualData) {

      this.setInitialDomLocation(this.$elm);
      this.$ancestorSection = utils.closest(this.$elm, '.article-section');

      if (this.$ancestorSection && utils.isCollapsibleArticleSection(this.$ancestorSection)) {
        this.setupSectionHandlers($elm, this.$ancestorSection, this.window);
      }
    }

    if (this. $ancestorSection || this.isContextualData) {
      this.hookUpDataProvider(this.$elm, '[data-visible-annotation-count]');
    }

  }

  findElementWithClass(className) {
    if (this.$elm.querySelector(`.${className}`)) {
      return this.$elm.querySelector(`.${className}`);
    }

    if (this.$elm.classList.contains(className)) {
      return this.$elm;
    }

    return null;

  }

  /**
   * Establishes showing the number, or the large double quote in article body if the number is 0
   * @param $elm
   */
  hookUpDataProvider($elm, visibleCountSelector) {

    // Updated by the hypothesis client
    const $dataProvider = $elm.querySelector('[data-hypothesis-annotation-count]');
    if (!$dataProvider) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        try {
          this.updateVisibleCount(mutation.addedNodes[0].data, visibleCountSelector, this.isContextualData);
        } catch (e) {
          console.error(e);
        }
      });
    });

    observer.observe($dataProvider, { childList:true });

  }

  updateVisibleCount(value, selector, isContextualData) {
    const count = parseInt(value);
    if (isNaN(count) || count < 0) {
      return;
    }

    if (isContextualData) {
      this.$elm.querySelector(selector).innerHTML = '' + count;
    } else {
      this.updateVisibleCountArticleBody(count, selector);
    }

  }

  updateVisibleCountArticleBody(count, selector) {
    if (count) {
      this.speechBubble.update(count, selector);
    } else {
      this.speechBubble.showPlaceholder(selector);
    }
  }

  setInitialDomLocation($elm) {
    try {
      const $anchorPoint = HypothesisOpener.findInitialAnchorPoint(this.doc);
      if ($anchorPoint) {
        $anchorPoint.appendChild($elm);
        return true;
      }

      return false;

    } catch (e) {
      console.error(e);
      return false;
    }
  }

  setupSectionHandlers($elm, $section, window) {
    this.lastKnownDisplayMode = HypothesisOpener.getCurrentDisplayMode(window);

    $section.addEventListener('collapsesection', () => {
      this.updateDomLocation($elm);
    });
    $section.addEventListener('expandsection', () => {
      this.updateDomLocation($elm);
    });

    window.addEventListener('resize', utils.debounce(() => this.handleResize(), 50));
  }

  static findInitialAnchorPoint($snippet) {
    const $abstract = $snippet.querySelector('#abstract');
    if ($abstract) {
      return $abstract.nextElementSibling.querySelector('.article-section__body');
    }

    // User-supplied content has unpredictable structure
    return $snippet.querySelector('.article-section:last-child p:last-child') ||
           $snippet.querySelector('.article-section:last-child ol:last-child') ||
           $snippet.querySelector('.article-section ~ p:last-child') ||
           $snippet.querySelector('.article-section ~ ol:last-child');
  }

  updateDomLocation($elm) {

    if (HypothesisOpener.getCurrentDisplayMode(this.window) === 'multiColumn') {

      if (utils.isCollapsedArticleSection(this.$ancestorSection)) {
        this.$ancestorSection.appendChild($elm);
      } else {
        this.$ancestorSection.querySelector('.article-section__body').appendChild($elm);
      }

    } else {
      this.setInitialDomLocation($elm, this.doc);
    }

  }

  static getCurrentDisplayMode(window) {
    if (utils.isMultiColumnDisplay(window)) {
      return 'multiColumn';
    }

    return 'singleColumn';
  }

  handleResize() {
    const currentDisplayMode = HypothesisOpener.getCurrentDisplayMode(this.window);
    if (currentDisplayMode !== this.lastKnownDisplayMode) {
      this.updateDomLocation(this.$elm);
      this.lastKnownDisplayMode = currentDisplayMode;
    }

  }

};
