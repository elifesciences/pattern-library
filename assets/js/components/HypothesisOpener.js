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
    this.$elm.classList.add('hypothesis-opener');
    this.$elm.dataset.hypothesisTrigger = '';
    this.speechBubble = new SpeechBubble(this.findElementWithClass('speech-bubble'));
    this.isContextualData = utils.areElementsNested(this.doc.querySelector('.contextual-data'), this.$elm);

    if (!this.isContextualData) {
      HypothesisOpener.applyStyleArticleBody(this.$elm);
      this.setInitialDomLocation(this.$elm, utils.getItemType(this.doc.querySelector('body')));
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

  static positionCentrallyInline($elm, $contentContainer) {
    const paragraphs = $contentContainer.querySelectorAll('p');

    if (!paragraphs.length) {
      $contentContainer.appendChild($elm);
      return;
    }

    $elm.classList.add('speech-bubble--inline');
    const $target = paragraphs[Math.floor((paragraphs.length - 1) / 2)];
    $target.insertBefore($elm, $target.firstChild);
  }

  static positionBySecondSection($elm, $contentContainer) {
    const $firstSection = $contentContainer.querySelector('.article-section--first');
    if ($firstSection) {
      $firstSection.nextElementSibling.querySelector('.article-section__body').appendChild($elm);
      return;
    }

    throw new Error('Trying to position hypothesis opener in second section, but ' +
                    'can\'t find element with the css class article-section--first.');
  }

  static positionByFirstSection($elm, $contentContainer) {
    const $firstSection = $contentContainer.querySelector('.article-section--first');
    if ($firstSection) {
      $firstSection.appendChild($elm);
      return;
    }

    throw new Error('Trying to position hypothesis opener by first section but can\'t find element' +
                    ' with the css class article-section--first.');
  }

  static findPositioningMethod(articleType) {
    const positioners = {
      'blog-article': HypothesisOpener.positionCentrallyInline,
      interview: HypothesisOpener.positionCentrallyInline,
      'press-package': HypothesisOpener.positionCentrallyInline,
      'labs-post': HypothesisOpener.positionCentrallyInline,

      insight: HypothesisOpener.positionBySecondSection,
      feature: HypothesisOpener.positionBySecondSection,
      editorial: HypothesisOpener.positionBySecondSection,

      default: HypothesisOpener.positionByFirstSection
    };

    return positioners[articleType] || positioners.default;
  }

  setInitialDomLocation($elm, articleType) {
    if (!articleType) {
      return;
    }

    try {
      HypothesisOpener.findPositioningMethod(articleType).call(null, $elm, this.doc.querySelector('.content-container'));
    } catch (e) {
      console.error(e);
    }
  }

};
