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

    this.speechBubble = this.setupSpeechBubble();
    this.isWithinContextualData = utils.areElementsNested(this.doc.querySelector('.contextual-data'), this.$elm);
    this.setupPlacementAndStyles(this.isWithinContextualData);

    let maxWaitTimer = null;
    try {
      maxWaitTimer = this.setupPreReadyIndicatorsWithTimer();
    } catch (e) {
      console.error(e);
      return;
    }

    const visibleCountSelector = '[data-visible-annotation-count]';
    this.hookUpDataProvider(this.$elm, this.isWithinContextualData, visibleCountSelector, maxWaitTimer);

    this.setupSectionExpansion(this.doc);

    // Declare this.$elm to be a trigger to open the Hypothesis client (click handled by Hypothesis)
    this.$elm.dataset.hypothesisTrigger = '';
  }

  setupPreReadyIndicatorsWithTimer() {
    const $loader = HypothesisOpener.get$hypothesisLoader(this.doc);

    const maxWaitTimer = this.window.setTimeout(() => {
      this.loadFailHandler();
    }, 10000);

    this.loadFailHandler = () => {
      this.handleLoadFail($loader, maxWaitTimer, this.window);
    };

    if (HypothesisOpener.hasLoadAlreadyFailed($loader)) {
      this.loadFailHandler();
    }

    $loader.addEventListener('loaderror', this.loadFailHandler);
    return maxWaitTimer;
  }

  setupSpeechBubble() {
    const speechBubble = new SpeechBubble(this.findElementWithClass('speech-bubble'));
    speechBubble.showLoadingIndicator();
    return speechBubble;
  }

  static hasLoadAlreadyFailed($loader) {
    return $loader.dataset.hypothesisEmbedLoadStatus === 'failed';
  }

  static get$hypothesisLoader(doc) {
    const $loader =  doc.getElementById('hypothesisEmbedder');
    if ($loader) {
      return $loader;
    }

    throw new Error('No Hypothesis loading code found.');
  }

  handleLoadFail($loader, timer, window) {
    this.handleInitFail(timer, window);
    $loader.removeEventListener('loaderror', this.loadFailHandler);
  }

  handleInitFail(timer, window, error = '') {
    this.indicateFail();
    window.clearTimeout(timer);
    if (error.length) {
      console.error(error);
    }
  }

  indicateFail() {
    this.speechBubble.showFailureState();
    throw new Error('Problem loading or interacting with Hypothesis client.');
  }

  setupSectionExpansion(doc) {
    this.$elm.addEventListener('click', () => {
      utils.expandCollapsedSections(doc);
    });

    if (this.isWithinContextualData) {
      const $prevEl = this.$elm.previousElementSibling;

      // Ugh. Refactor this away when the right pattern construction for opening h client becomes apparent
      if (!!$prevEl && $prevEl.classList.contains('contextual-data__item__hypothesis_opener')) {
        $prevEl.addEventListener('click', () => {
          utils.expandCollapsedSections(doc);
        });
      }
    }
  }

  setupPlacementAndStyles(isContextualData) {
    HypothesisOpener.applyStyleInitial(this.$elm);
    if (isContextualData) {
      HypothesisOpener.applyStyleArticleBody(this.$elm);
      this.setInitialDomLocation(this.$elm, utils.getItemType(this.doc.querySelector('body')));
    }
  }

  static applyStyleInitial($elm) {
    $elm.classList.add('hypothesis-opener');
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

  hookUpDataProvider($elm, isWithinContextualData, visibleCountSelector, timer) {

    // Updated by the hypothesis client
    const $dataProvider = $elm.querySelector('[data-hypothesis-annotation-count]');
    if (!$dataProvider) {
      this.handleInitFail(timer, this.window);
      return;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        try {
          this.updateVisibleCount(mutation.addedNodes[0].data, visibleCountSelector, isWithinContextualData);
          this.window.clearTimeout(timer);
        } catch (e) {
          this.handleInitFail(timer, this.window, error);
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
