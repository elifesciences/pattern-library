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

    this.isWithinContextualData = utils.areElementsNested(this.doc.querySelector('.contextual-data'), this.$elm);
    this.speechBubble = this.setupSpeechBubble(this.isWithinContextualData);
    this.setupPlacementAndStyles(this.isWithinContextualData);

    let maxWaitTimer = null;
    let $loader = null;
    try {
      $loader = HypothesisOpener.get$hypothesisLoader(this.doc);
      maxWaitTimer = this.setupPreReadyIndicatorsWithTimer($loader);
    } catch (e) {
      this.window.console.error(e);
      if (!!$loader && $loader instanceof HTMLElement) {
        $loader.parentNode.removeChild($loader);
      }

      if (typeof this.window.newrelic === 'object') {
        this.window.newrelic.noticeError(e);
      }

      return;
    }

    const visibleCountSelector = '[data-visible-annotation-count]';
    this.hookUpDataProvider(this.$elm, this.isWithinContextualData, visibleCountSelector, maxWaitTimer);

    // Declare this.$elm to be a trigger to open the Hypothesis client (click handled by Hypothesis)
    this.$elm.dataset.hypothesisTrigger = '';
  }

  // It is an error for any of:
  //  - the load has already failed
  //  - the loaderror event fires before Hypothesis is ready
  //  - the maxWaitTimer expires
  setupPreReadyIndicatorsWithTimer($loader) {

    if (HypothesisOpener.hasLoadAlreadyFailed($loader)) {
      // Already-failed loading should already have thrown an error, so don't throw again.
      this.handleInitFail(null, this.window, false);
      return;
    }

    const maxWaitTime = 120000;

    const maxWaitTimer = this.window.setTimeout(this.handleTimerExpired.bind(this), maxWaitTime);

    $loader.addEventListener('loaderror', (e) => {
      this.handleInitFail(maxWaitTimer, this.window, e);
    });

    return maxWaitTimer;
  }

  handleInitFail(timer, win, err) {
    this.removeHypothesisUI();
    this.speechBubble.showFailureState(this.isWithinContextualData);
    const window = win || this.window;
    window.clearTimeout(timer);

    // Do not log the error (use when error will already have been logged elsewhere).
    if (err === false) {
      return;
    }

    let errorMsg;
    if (err && typeof err.message === 'string') {
      errorMsg = err.message;
    } else {
      errorMsg = 'Problem loading or interacting with Hypothesis client.';
    }

    // Needs to be explicitly thrown to get a stack trace from Safari.
    // https://docs.newrelic.com/docs/browser/new-relic-browser/browser-agent-spa-api/notice-error
    try {
      throw new Error(errorMsg);
    } catch (e) {
      this.window.console.error(e);
      if (typeof this.window.newrelic === 'object') {
        this.window.newrelic.noticeError(e);
      }
    }
  }

  handleTimerExpired() {
    this.handleInitFail(null, this.window, new Error('Hypothesis loading timed out'));
  }

  removeHypothesisUICounters() {
    const counters = this.doc.querySelectorAll('[data-visible-annotation-count]');
    if (counters) {
      [].forEach.call(counters, (counter) => {
        const visuallyHiddenCounter = counter.parentNode.parentNode.querySelector('.visuallyhidden');
        visuallyHiddenCounter.innerHTML = '';
        delete counter.dataset.visibleAnnotationCount;
      });
    }
  }

  removeHypothesisUISidebar() {
    const sidebar = this.doc.querySelector('.annotator-frame');
    if (sidebar) {
      sidebar.parentElement.removeChild(sidebar);
    }
  }

  removeHypothesisUITriggers() {
    const triggers = this.doc.querySelectorAll('[data-hypothesis-trigger]');
    if (triggers) {
      [].forEach.call(triggers, ($trigger) => {
        delete $trigger.dataset.hypothesisTrigger;
      });
    }
  }

  removeHypothesisUIPopupOnSelect() {
    let obs;
    const remove$hypothesisAdder = (addedNode) => {
      if (addedNode.nodeName === 'HYPOTHESIS-ADDER') {
        const adder = this.doc.querySelector('hypothesis-adder');
        if (adder && typeof adder.parentElement) {
          adder.parentElement.removeChild(adder);
          obs.disconnect();
        }
      }
    };

    const observerCallback = (mutationsList) => {
      for (let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length) {
          [].forEach.call(mutation.addedNodes, remove$hypothesisAdder);
        }
      }

    };

    const popup = this.doc.querySelector('hypothesis-adder');
    if (popup) {
      popup.parentElement.removeChild(popup);
    } else {
      obs = new MutationObserver(observerCallback);
      obs.observe(this.doc.querySelector('body'), { childList: true });
    }

  }

  removeHypothesisUI() {
    this.removeHypothesisUICounters();
    this.removeHypothesisUISidebar();
    this.removeHypothesisUITriggers();
    this.removeHypothesisUIPopupOnSelect();
  }

  setupSpeechBubble(isContextualData) {
    const speechBubble = new SpeechBubble(this.findElementWithClass('speech-bubble'));

    if (isContextualData) {
      speechBubble.showLoadingIndicator();
    }

    return speechBubble;
  }

  static hasLoadAlreadyFailed($loader) {
    return $loader.dataset.hypothesisEmbedLoadStatus === 'failed';
  }

  static get$hypothesisLoader($ancestor) {
    const $loader =  $ancestor.querySelector('#hypothesisEmbedder');
    if ($loader) {
      return $loader;
    }

    throw new Error('No Hypothesis loading code found');
  }

  setupPlacementAndStyles(isContextualData) {
    HypothesisOpener.applyStyleInitial(this.$elm);
    if (!isContextualData) {
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
          if (!mutation.addedNodes[0]) {
            return;
          }

          this.updateVisibleCount(mutation.addedNodes[0].data, visibleCountSelector, isWithinContextualData);
          this.speechBubble.removeLoadingIndicator();
          this.window.clearTimeout(timer);
        } catch (error) {
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
    const $target = HypothesisOpener.findTarget($contentContainer);
    if (!$target) {
      $contentContainer.appendChild($elm);
      return;
    }

    $elm.classList.add('speech-bubble--inline');
    $target.insertBefore($elm, $target.firstChild);
    HypothesisOpener.wrappedInContainer($elm);
  }

  static positionBySecondSection($elm, $contentContainer) {
    const $firstSection = $contentContainer.querySelector('.article-section--first');
    if ($firstSection) {
      $firstSection.nextElementSibling.querySelector('.article-section__body').appendChild($elm);
      HypothesisOpener.wrappedInContainer($elm);
      return;
    }

    throw new Error('Trying to position hypothesis opener in second section, but ' +
                    'can\'t find element with the css class article-section--first.');
  }

  static positionByFirstSection($elm, $contentContainer) {
    const $firstSection = $contentContainer.querySelector('.article-section--first');
    if ($firstSection) {
      $firstSection.appendChild($elm);
      HypothesisOpener.wrappedInContainer($elm);
      return;
    }

    throw new Error('Trying to position hypothesis opener by first section but can\'t find element' +
                    ' with the css class article-section--first.');
  }

  static wrappedInContainer($elm) {
    if ($elm.classList.contains('speech-bubble--wrapped')) {
      const speechBubbleContainer = document.createElement('div');
      speechBubbleContainer.classList.add('speech-bubble--container');
      $elm.parentNode.insertBefore(speechBubbleContainer, $elm);
      speechBubbleContainer.appendChild($elm);
    }
  }

  static positionEnd($elm, $contentContainer) {
    $contentContainer.appendChild($elm);
    HypothesisOpener.wrappedInContainer($elm);
  }

  static findPositioningMethod(articleType) {
    const positioners = {
      'blog-article': HypothesisOpener.positionCentrallyInline,
      interview: HypothesisOpener.positionCentrallyInline,
      'press-package': HypothesisOpener.positionCentrallyInline,
      'labs-post': HypothesisOpener.positionCentrallyInline,

      digest: HypothesisOpener.positionEnd,

      insight: HypothesisOpener.positionBySecondSection,
      feature: HypothesisOpener.positionBySecondSection,
      editorial: HypothesisOpener.positionBySecondSection,

      default: HypothesisOpener.positionByFirstSection
    };

    return positioners[articleType] || positioners.default;
  }

  static findTarget($contentContainer) {
    let target = null;
    const centre = Math.floor(($contentContainer.querySelectorAll('p').length - 1) / 2);
    [].forEach.call($contentContainer.querySelectorAll('p'), (possible, index) => {
      if (
        target === null &&
        index >= centre &&
        !HypothesisOpener.targetWithinInLineProfile(possible) &&
        !HypothesisOpener.targetWithinBlockquote(possible) &&
        !HypothesisOpener.targetBelowSectionHeading(possible)
      ) {
        target = possible;
      }
    });

    return target;
  }

  static targetWithinInLineProfile($target) {
    return $target.parentNode.parentNode.classList.contains('inline-profile');
  }

  static targetWithinBlockquote($target) {
    return $target.parentNode.nodeName === 'BLOCKQUOTE';
  }

  static targetBelowSectionHeading($target) {
    return (
      utils.getOrdinalAmongstSiblingElements($target) === 1 &&
      $target.parentNode.parentNode.classList.contains('article-section')
    );
  }

  setInitialDomLocation($elm, articleType) {
    if (!articleType) {
      return;
    }

    try {
      HypothesisOpener.findPositioningMethod(articleType).call(null, $elm, this.doc.querySelector('.content-container'));
    } catch (e) {
      this.window.console.error(e);
    }
  }

};
