'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class HypothesisOpenerAffordance {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.isSingleton = true;

    // If no collapsible sections on the page, bail here.  Or perhaps don't even include this behaviour at all.

    this.thresholdWidth = 900;
    this.lastKnownDisplayMode = HypothesisOpenerAffordance.getCurrentDisplayMode(this.thresholdWidth, this.window);
    this.displayModeAtLatestSectionVisChange = HypothesisOpenerAffordance.getCurrentDisplayMode(this.thresholdWidth, this.window);

    HypothesisOpenerAffordance.establishInitialDomLocation(this.$elm, document);

    this.$ancestorSection =  utils.closest(this.$elm, '.article-section');
    this.$ancestorSection.addEventListener('collapsesection', (e) => this.updateDomLocation(this.$elm, e));
    this.$ancestorSection.addEventListener('expandsection', (e) => this.updateDomLocation(this.$elm, e));
    this.window.addEventListener('resize', utils.debounce(() => this.handleResize(), 50));
  }

  static establishInitialDomLocation($elm, document) {
    const $anchorPoint = HypothesisOpenerAffordance.findInitialAnchorPoint(document);
    if ($anchorPoint) {
      $anchorPoint.appendChild($elm);
    }
  }

  static findInitialAnchorPoint($snippet) {
    const $abstract = $snippet.querySelector('#abstract');
    if ($abstract) {
      return $abstract.nextElementSibling.querySelector('.article-section__body');
    }

    return $snippet.querySelector('.article-section:last-child p:last-child');
  }

  updateDomLocation($elm) {

    if (HypothesisOpenerAffordance.getCurrentDisplayMode(this.thresholdWidth, this.window) === 'multiColumn') {

      if (HypothesisOpenerAffordance.isCollapsedSection(this.$ancestorSection)) {
        this.$ancestorSection.appendChild($elm);
      } else {
        this.$ancestorSection.querySelector('.article-section__body').appendChild($elm);
      }

    } else {
      HypothesisOpenerAffordance.establishInitialDomLocation($elm, this.doc);
    }

  }

  static getCurrentDisplayMode(thresholdWidth, window) {
    if (window.matchMedia(`(min-width: ${thresholdWidth}px)`).matches) {
      return 'multiColumn';
    }

    return 'singleColumn';
  }

  handleResize() {
    const currentDisplayMode = HypothesisOpenerAffordance.getCurrentDisplayMode(this.thresholdWidth, this.window);
    if (currentDisplayMode !== this.lastKnownDisplayMode/* && currentDisplayMode === 'multiColumn'*/) {
      this.updateDomLocation(this.$elm);
      this.lastKnownDisplayMode = currentDisplayMode;
    }

  }

  static isCollapsedSection($elm) {
    return $elm.classList.contains('article-section--collapsed');
  }

};
