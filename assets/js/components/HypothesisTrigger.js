'use strict';

module.exports = class HypothesisTrigger {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    let maxWaitTimer = null;

    const visibleCountSelector = '[data-visible-annotation-count]';
    this.hookUpDataProvider(this.$elm, visibleCountSelector, maxWaitTimer);

    // Declare this.$elm to be a trigger to open the Hypothesis client (click handled by Hypothesis)
    this.$elm.dataset.hypothesisTrigger = '';
  }

  // It is an error for any of:
  //  - the load has already failed
  //  - the loaderror event fires before Hypothesis is ready
  //  - the maxWaitTimer expires
  setupPreReadyIndicatorsWithTimer($loader) {

    if (HypothesisTrigger.hasLoadAlreadyFailed($loader)) {
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

    this.window.console.error(new Error(errorMsg));
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

  hookUpDataProvider($elm, visibleCountSelector, timer) {

    // Updated by the hypothesis client
    const $dataProvider = $elm.querySelector('[data-hypothesis-annotation-count]');
    if (!$dataProvider) {
      this.handleInitFail(timer, this.window);
      return;
    }

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        try {
          if (!mutation.addedNodes[0]) {
            return;
          }

          this.updateVisibleCount(mutation.addedNodes[0].data, visibleCountSelector);
          this.window.clearTimeout(timer);
        } catch (error) {
          this.handleInitFail(timer, this.window, error);
        }
      });
    });

    observer.observe($dataProvider, { childList:true });

  }

  updateVisibleCount(value, selector) {
    const count = parseInt(value);
    if (isNaN(count) || count < 0) {
      return;
    }

    this.updateVisibleCountArticleBody(count, selector);

  }

  updateVisibleCountArticleBody(count, selector) {
    const target = this.$elm.querySelector(selector);
    if (count) {
      target.innerHTML = '&nbsp;(' + count + ')';
    } else {
      target.innerHTML = '';
    }
  }

};
