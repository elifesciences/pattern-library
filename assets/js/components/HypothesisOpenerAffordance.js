'use strict';

module.exports = class HypothesisOpenerAffordance {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.isSingleton = true;

    this.thresholdWidth = 730;
    HypothesisOpenerAffordance.position(document, this.$elm);
  }

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

  getCurrentDisplayMode(window) {
    if (window.matchMedia(`(min-width: ${this.thresholdWidth}px)`).matches) {
      return 'multiColumn';
    }

    return 'singleColumn';
  }

};
