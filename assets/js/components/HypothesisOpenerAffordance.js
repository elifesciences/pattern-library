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

    this.thresholdWidth = 900;
    HypothesisOpenerAffordance.moveToDesiredDomLocation(this.$elm, document);

    this.$ancestorSection =  utils.closest(this.$elm, '.article-section');
    this.$ancestorSection.addEventListener('collapsesection', () => this.promote$elmByOneLevel(this.$elm));
    this.$ancestorSection.addEventListener('expandsection', () => this.handleSectionExpand(this.$elm));
  }

  //TODO: cater for open wide -> collapse -> shrink screen

  static moveToDesiredDomLocation($elm, document) {
    const $anchorPoint = HypothesisOpenerAffordance.findAnchorPoint(document);
    if ($anchorPoint) {
      $anchorPoint.appendChild($elm);
    }
  }

  static findAnchorPoint($snippet) {
    const $abstract = $snippet.querySelector('#abstract');
    if ($abstract) {
      return $abstract.nextElementSibling.querySelector('.article-section__body');
    }

    return $snippet.querySelector('.article-section:last-child p:last-child');
  }

  promote$elmByOneLevel($elm) {
    if (this.getCurrentDisplayMode(this.window) === 'multiColumn') {
      $elm.parentNode.parentNode.appendChild($elm);
    }
  }

  handleSectionExpand($elm) {
    if (this.getCurrentDisplayMode(this.window) === 'multiColumn') {
      $elm.parentNode.querySelector('.article-section__body').appendChild($elm);
    }
  }

  getCurrentDisplayMode(window) {
    if (window.matchMedia(`(min-width: ${this.thresholdWidth}px)`).matches) {
      return 'multiColumn';
    }

    return 'singleColumn';
  }

};
