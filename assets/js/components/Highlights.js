'use strict';
var utils = require('../libs/elife-utils')();

console.log('Highlights.js - ');

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

    var body = document.querySelector('body');
    body.addEventListener('keyup', this.checkTabPress.bind(this));
  }

  checkTabPress(e) {
    "use strict";

    e = e || event;
    let activeElement;

    //console.log('start of checkTabPress', e, e.keyCode, e.shiftKey);
    if (e.keyCode == 9) {

      activeElement = document.activeElement;

      if (activeElement.tagName.toLowerCase() == 'a' && activeElement.classList.contains('teaser__header_text_link')) {

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
    return this.currentSlide >= (this.maxOffset);
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
      this.maxOffset = 5;

    } else if (this.viewportNoWiderThan(this.desktopWidth)) {

      this.viewport = 'TABLET';
      this.inView = 2;
      this.maxSlide = 4;
      this.maxOffset = 4;

    } else {

      this.viewport = 'DESKTOP';
      this.inView = 3;
      this.maxSlide = 3;
      this.maxOffset = 3;
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

    let slide = this.currentSlide;
    this.goToSlide(slide);

  }

  goToSlide(thisSlide) {
    console.log("goToSlide()", thisSlide);
    const margin = 40;
    const numOfMargins = this.inView - 1;
    const totalMargins = numOfMargins * margin;

    // Width of carousel container
    let carouselWidth = window.getComputedStyle(this.$elm).width.match(/([0-9\.]+)px/)[1];

    // Slide width = Carousel width - margins / number in view
    const slideWidth = (carouselWidth - totalMargins) / this.inView;

    // Slide offset = Slide width plus margin
    const slideOffset = slideWidth + margin;

    // Negative offset of 'x' slide offsets
    let nudge = slideOffset * (thisSlide - 1) * -1;

    // Transform
    this.moveableStage.style.transform = 'translate(' + nudge + 'px, 0)';

    // Reset any scroll lefts
    this.$elm.scrollLeft = 0;
  }

  hideElm() {

    this.$elm.classList.add('visuallyhidden');

  }

  showElm() {

    this.$elm.classList.remove('visuallyhidden');

  }

};