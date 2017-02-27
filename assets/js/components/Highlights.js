'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class Highlights {

  constructor($elm, _window = window, doc = document) {

    if (!($elm instanceof HTMLElement)) {
      return;
    }

    this.window = _window;
    this.$elm = $elm;
    this.doc = doc;
    this.tabletWidth = 640;
    this.desktopWidth = 980;
    this.currentSlide = 1;
    this.timerInterval = 10000;
    this.$prevBtn = doc.querySelector('.trigger--prev');
    this.$nextBtn = doc.querySelector('.trigger--next');
    this.$prevBtn.addEventListener('click', this.previousButton.bind(this));
    this.$nextBtn.addEventListener('click', this.nextButton.bind(this));
    this.moveableStage = this.$elm.querySelector('.listing-list--highlights');
    this.originalSlideWrappers = this.moveableStage.querySelectorAll('.listing-list__item');
    this.switchBreakpoint();
    this.window.addEventListener('resize', utils.debounce(() => this.switchBreakpoint(), 100));
    this.adjustTranslateForResize();
  }

  isFirstSlide() {
    return this.currentSlide <= 1;
  }

  isLastSlide() {
    return this.currentSlide >= (this.maxSlide);
  }

  previousButton() {
    if (this.isFirstSlide()) {
      return null;
    }

    this.currentSlide = this.currentSlide - 1;
    this.adjustTranslateForResize();
  }

  nextButton() {
    if (this.isLastSlide()) {
      return null;
    }

    this.currentSlide = this.currentSlide + 1;
    this.adjustTranslateForResize();
  }

  viewportNoWiderThan(thresholdInPx) {
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  resetStage() {
    this.moveableStage.style.transform = 'translate(0px, 0)';
    this.currentSlide = 1;

    this.$prevBtn.style.display = 'none';
    this.$nextBtn.style.display = 'block';
  }

  switchBreakpoint() {

    utils.equalizeHeightOfItems('listing-list--highlights', 'teaser__header');

    this.resetStage();

    if (this.viewportNoWiderThan(this.tabletWidth)) {

      this.viewport = 'MOBILE';
      this.inView = 1;
      this.maxSlide = 5;

    } else if (this.viewportNoWiderThan(this.desktopWidth)) {

      this.viewport = 'TABLET';
      this.inView = 2;
      this.maxSlide = 4;

    } else {

      this.viewport = 'DESKTOP';
      this.inView = 3;
      this.maxSlide = 3;
    }

  }

  adjustTranslateForResize() {

    if (this.isFirstSlide()) {
      this.$prevBtn.style.display = 'none';
    } else {
      this.$prevBtn.style.display = 'block';
    }

    if (this.isLastSlide()) {
      this.$nextBtn.style.display = 'none';
    } else {
      this.$nextBtn.style.display = 'block';
    }

    let carouselWidth = window.getComputedStyle(this.$elm).width.match(/([0-9\.]+)px/)[1];
    let currentSlide = this.currentSlide;
    let expectedOffset = (currentSlide - 1) * carouselWidth * -1;
    let nudge = (expectedOffset - (currentSlide -1) * 40) / this.inView;

    this.moveableStage.style.transform = 'translate(' + nudge + 'px, 0)';

  }

  hideElm() {

    this.$elm.classList.add('visuallyhidden');

  }

  showElm() {

    this.$elm.classList.remove('visuallyhidden');

  }

};
