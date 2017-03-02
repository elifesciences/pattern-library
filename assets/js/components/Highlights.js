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
    this.$prevBtn = $elm.querySelector('.trigger--prev');
    this.$nextBtn = $elm.querySelector('.trigger--next');
    this.$prevBtn.addEventListener('click', this.previousButton.bind(this));
    this.$nextBtn.addEventListener('click', this.nextButton.bind(this));
    this.moveableStage = this.$elm.querySelector('.listing-list--highlights');
    this.originalSlideWrappers = this.moveableStage.querySelectorAll('.listing-list__item');
    this.numSlides = this.moveableStage.querySelectorAll('.listing-list__item').length;
    this.switchBreakpoint();
    this.window.addEventListener('resize', utils.debounce(() => this.switchBreakpoint(), 1000));

    let body = document.querySelector('body');
    body.addEventListener('keyup', this.checkTabPress.bind(this));
  }



  checkTabPress(e) {

    e = e || {};
    let activeElement;

    if (e.keyCode === 9) {

      activeElement = document.activeElement;

      if (activeElement.tagName.toLowerCase() === 'a'
          && activeElement.classList.contains('teaser__header_text_link')
      ) {

        if (this.currentSlide === 1) {
          this.resetStage();
        }

        if (this.currentSlide < this.maxOffset) {

          this.currentSlide = parseInt(activeElement.getAttribute('data-slide'), 10);
          this.adjustTranslateForResize();
        }

      }
    }
  }

  isFirstSlide() {
    return this.currentSlide <= 1;
  }

  isLastSlide() {
    return this.currentSlide === this.maxOffset;
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

    if (this.inView && this.numSlides > 3) {
      this.$prevBtn.style.display = 'none';
      this.$nextBtn.style.display = 'block';
    }

  }

  switchBreakpoint() {
    utils.equalizeHeightOfItems('listing-list--highlights', 'teaser__header');

    this.resetStage();

    if (this.viewportNoWiderThan(this.tabletWidth)) {

      this.inView = 1;
      this.maxOffset = this.numSlides;

    } else if (this.viewportNoWiderThan(this.desktopWidth)) {

      this.inView = 2;
      this.maxOffset = this.numSlides - 1;

    } else {

      this.inView = 3;
      this.maxOffset = this.numSlides - 2;
    }

    this.adjustTranslateForResize();
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

    this.goToSlide(this.currentSlide);
  }

  goToSlide(thisSlide) {
    const margin = 40;
    const numOfMargins = this.inView - 1;
    const totalMargins = numOfMargins * margin;

    // Width of carousel container
    const carouselWidth = window.getComputedStyle(this.$elm).width.match(/([0-9\.]+)px/)[1];

    // Slide width = Carousel width - margins / number in view
    const slideWidth = (carouselWidth - totalMargins) / this.inView;

    // Slide offset = Slide width plus margin
    const slideOffset = slideWidth + margin;

    // Negative offset of 'x' slide offsets
    const nudge = slideOffset * (thisSlide - 1) * -1;

    // Transform
    this.moveableStage.style.transform = 'translate(' + nudge + 'px, 0)';

    // Reset any scroll lefts
    this.$elm.scrollLeft = 0;
  }

};
