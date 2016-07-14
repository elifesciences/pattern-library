'use strict';

module.exports = class ContentHeaderBackgroundImage {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.$elm.classList.add('content-header-background-image--js');
    this.sourceToUse = ContentHeaderBackgroundImage.calcSourceToUse(this.$elm, this.isHighDpr());
    this.setBackground(this.sourceToUse);
  }

  setBackground(path) {
    if (!path || !path.length || path.length === 0) {
      return;
    }

    let semiTransparentBlack = 'linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))';
    this.$elm.style.backgroundImage = semiTransparentBlack + ', url(' + path + ')';
  }

  static calcSourceToUse(sourceDefiner, isHighDpr) {
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

  isHighDpr() {
    if (!!this.window.devicePixelRatio) {
      return this.window.devicePixelRatio >= 2;
    }

    return false;
  }

};
