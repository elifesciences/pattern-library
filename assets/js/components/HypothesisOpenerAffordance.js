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

    this.setInitialDomLocation(this.$elm);

    this.$ancestorSection = utils.closest(this.$elm, '.article-section');
    if (this.$ancestorSection && utils.isCollapsibleArticleSection(this.$ancestorSection)) {
      this.setupSectionHandlers($elm, this.$ancestorSection, this.window);
    }

  }

  setInitialDomLocation($elm) {
    const $anchorPoint = HypothesisOpenerAffordance.findInitialAnchorPoint(this.doc);
    if ($anchorPoint) {
      $anchorPoint.appendChild($elm);
    }
  }

  setupSectionHandlers($elm, $section, window) {
    this.lastKnownDisplayMode = HypothesisOpenerAffordance.getCurrentDisplayMode(window);

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

    if (HypothesisOpenerAffordance.getCurrentDisplayMode(this.window) === 'multiColumn') {

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
    const currentDisplayMode = HypothesisOpenerAffordance.getCurrentDisplayMode(this.window);
    if (currentDisplayMode !== this.lastKnownDisplayMode) {
      this.updateDomLocation(this.$elm);
      this.lastKnownDisplayMode = currentDisplayMode;
    }

  }

};
