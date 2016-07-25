'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class ContentHeaderBackgroundImage {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    let semiTransparentBlack = 'linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))';

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.$elm.classList.add('content-header-background-image--js');
    this.sourceToUse = this.calcSourceToUse(this.$elm, utils.isHighDpr(this.window));
    this.$elm.style.backgroundImage = this.setBackground(this.sourceToUse, semiTransparentBlack);
  }

  setBackground(path, semiTransparentBlack) {
    if (!path || !path.length || path.length === 0) {
      return '';
    }

    return semiTransparentBlack + ', url(' + path + ')';
  }

  calcSourceToUse(sourceDefiner, isHighDpr) {
    var lowResSource = '';
    var highResSource = '';
    if (!sourceDefiner) {
      return '';
    }

    if (!!sourceDefiner.dataset) {
      highResSource = sourceDefiner.dataset.highResImageSource;
      lowResSource = sourceDefiner.dataset.lowResImageSource;
    } else {
      highResSource = sourceDefiner.getAttribute('data-highResImageSource');
      lowResSource = sourceDefiner.getAttribute('data-lowResImageSource');
    }

    if (isHighDpr && !highResSource || !isHighDpr && !lowResSource) {
      return '';
    }

    if (isHighDpr) {
      return highResSource;
    }

    return lowResSource;
  }

};
