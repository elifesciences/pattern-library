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

    HypothesisOpener.applyStyleInitial(this.$elm);
    this.$elm.dataset.hypothesisTrigger = '';
    this.speechBubble = new SpeechBubble(this.findElementWithClass('speech-bubble'));
    this.isContextualData = utils.areElementsNested(this.doc.querySelector('.contextual-data'), this.$elm);
    this.$elm.classList.add('hypothesis-opener');

    if (!this.isContextualData) {

      HypothesisOpener.applyStyleArticleBody(this.$elm);
      this.setInitialDomLocation(this.$elm);
      this.$ancestorSection = utils.closest(this.$elm, '.article-section');

    }

    this.hookUpDataProvider(this.$elm, '[data-visible-annotation-count]');

    this.containingArticleTogglableSections = this.doc.querySelectorAll('.article-section--js');
    this.setupSectionExpansion(this.containingArticleTogglableSections);

  }

  setupSectionExpansion(sections) {
    if (!(sections instanceof NodeList)) {
      return;
    }

    this.$elm.addEventListener('click', () => {
      this.expandAllArticleSections([].slice.call(sections));
    });

    if (this.isContextualData) {
      const $prevEl = this.$elm.previousElementSibling;

      // Ugh. Refactor this away when the right pattern construction for opening h client becomes apparent
      if (!!$prevEl && $prevEl.classList.contains('contextual-data__item__hypothesis_opener')) {
        $prevEl.addEventListener('click', () => {
          this.expandAllArticleSections([].slice.call(sections));
        });
      }
    }
  }

  expandAllArticleSections(sections) {
    sections.forEach(($section) => {
      $section.dispatchEvent(utils.eventCreator('expandsection'));
    });
  }

  static applyStyleInitial($elm) {
    $elm.style.display = 'inline-block';
    $elm.style.cursor = 'pointer';

  }

  static applyStyleArticleBody($elm) {
    $elm.style.display = 'block';
    $elm.style.float = 'right';
    $elm.style.marginBottom = '48px';
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

};
