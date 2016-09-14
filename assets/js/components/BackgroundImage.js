'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class BackgroundImage {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;

    this.sourceToUse = null;
    this.thresholdWidth = parseInt(this.$elm.dataset.thresholdWidth, 10);
    if (this.isValidThreshold(this.thresholdWidth) &&
        !this.isThresholdMet(this.thresholdWidth, this.window.innerWidth)) {
      this.window.addEventListener('resize', this.resizeHandler.bind(this));
    } else {
      this.init();
    }

  }

  init() {
    this.sourceToUse = this.calcSourceToUse(this.$elm, utils.isHighDpr(this.window));
    this.setDarkBackground();
    this.setupEventHandlers(this.$elm,
                            this.setLightBackground.bind(this),
                            this.setDarkBackground.bind(this));
  }

  isValidThreshold(candidate) {
    return !(
      typeof candidate === 'boolean' ||
      candidate === null ||
      Array.isArray(candidate) ||
      isNaN(candidate) ||
      candidate < 0
    );

  }

  isThresholdMet(threshold, viewportWidth) {
    return viewportWidth >= threshold;
  }

  resizeHandler() {
    if (this.isThresholdMet(this.thresholdWidth, this.window.innerWidth)) {
      this.window.removeEventListener('resize', this.resizeHandler.bind(this));
      this.init();
    }
  }

  setupEventHandlers($elm, setLightBackground, setDarkBackground) {
    if ($elm.getAttribute('data-invert-bgcol-on-hover') !== null) {
      $elm.addEventListener('mouseenter', setLightBackground);
      $elm.addEventListener('mouseleave', setDarkBackground);
    }
  }

  setDarkBackground() {
    if (!!this.sourceToUse) {
      this.$elm.style.backgroundImage = this.getBackgroundImagesString(this.sourceToUse,
                      'linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))');
      this.$elm.style.color = '#fff';
    }
  }

  setLightBackground() {
    if (!!this.sourceToUse) {
      this.$elm.style.backgroundImage = this.getBackgroundImagesString(this.sourceToUse,
                     'linear-gradient(to top, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))');
      this.$elm.style.color = '#212121';
    }
  }

  getBackgroundImagesString(path, grandient) {
    if (!path || !path.length || path.length === 0) {
      return '';
    }

    return grandient + ', url(' + path + ')';
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
