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
    HypothesisOpenerAffordance.position(document, this.$elm);

    this.$sectionAncestor =  utils.closest(this.$elm, '.article-section--js');

    this.$sectionAncestor.addEventListener('collapsesection', () => this.promote$elmByOneLevel(this.$elm));
    this.$sectionAncestor.addEventListener('expandsection', this.handleSectionExpand.bind(this));
  }

  //TODO: cater for open wide -> collapse -> shrink screen

  static position(document, $elm) {
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

  handleSectionExpand() {
    if (this.getCurrentDisplayMode(this.window) === 'multiColumn') {
      this.$elm.parentNode.querySelector('.article-section__body').appendChild(this.$elm);
    }
  }

  getCurrentDisplayMode(window) {
    if (window.matchMedia(`(min-width: ${this.thresholdWidth}px)`).matches) {
      return 'multiColumn';
    }

    return 'singleColumn';
  }

};
