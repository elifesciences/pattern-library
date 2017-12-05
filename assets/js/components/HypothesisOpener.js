'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class HypothesisOpener {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.isSingleton = true;

    this.$elm.dataset.hypothesisTrigger = '';

    this.setInitialDomLocation(this.$elm);

    this.$ancestorSection = utils.closest(this.$elm, '.article-section');
    if (this.$ancestorSection && utils.isCollapsibleArticleSection(this.$ancestorSection)) {
      this.setupSectionHandlers($elm, this.$ancestorSection, this.window);
      this.hookUpDataProvider(this.$elm);
    }

  }

  /**
   * Establishes showing the number if annotation count > 0, otherwise the large double quote
   * @param $elm
   */
  hookUpDataProvider($elm) {

    // Updated by the hypothesis client
    const $dataProvider = $elm.querySelector('[data-hypothesis-annotation-count]');
    if (!$dataProvider) {
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        try {
          HypothesisOpener.updateVisibleCount(mutation.addedNodes[0].data, $elm);
        } catch (e) {
          console.error(e);
        }
      });
    });

    observer.observe($dataProvider, { childList:true });

  }

  static updateVisibleCount(value, $elm) {
    const count = parseInt(value);
    if (isNaN(count) || count < 0) {
      return;
    }

    let visibleCount;
    if (count) {
      visibleCount = count;
      $elm.querySelector('.button--speech-bubble').classList.add('button--speech-bubble-populated');
    } else {
      visibleCount = '&#8220;';
      $elm.querySelector('.button--speech-bubble').classList.remove('button--speech-bubble-populated');
    }

    $elm.querySelector('[data-visible-annotation-count]').innerHTML = visibleCount;

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

    return $snippet.querySelector('.article-section:last-child p:last-child');
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
