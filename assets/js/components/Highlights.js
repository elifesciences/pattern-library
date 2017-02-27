'use strict';
var utils = require('../libs/elife-utils')();

console.log("Highlights.js - C");

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

    // prevBtn.addEventListener('click', () => {
    //   console.log(' prevBtn click');
    //
    //   this.currentSlide === 1 ? this.currentSlide = 1 : this.currentSlide -= 1;
    //
    //   if(this.currentSlide == 1) {
    //     console.log("MIN");
    //     //this.hideElm();
    //   }
    //
    //   this.adjustTranslateForResize();
    // });
    //
    // nextBtn.addEventListener('click', () => {
    //   console.log(' nextBtn click');
    //
    //   this.currentSlide === this.maxSlide ? this.currentSlide = this.maxSlide : this.currentSlide += 1;
    //
    //   if(this.currentSlide == this.maxSlide) {
    //     console.log("MAX");
    //     //this.hideElm();
    //   }
    //
    //   this.adjustTranslateForResize();
    // });

  }

  isFirstSlide() {
    console.log("isFirstSlide()", this.currentSlide);
    return this.currentSlide <= 1;
  }

  isLastSlide() {
    console.log("isLastSlide() ms:" + this.maxSlide, this.currentSlide);
    return this.currentSlide >= (this.maxSlide);
  }

  previousButton() {
    console.log("previousButton()", this.currentSlide);
    if (this.isFirstSlide()) {
      return null;
    }

    this.currentSlide = this.currentSlide - 1;

    this.adjustTranslateForResize();
  }

  nextButton() {
    console.log("nextButton()", this.currentSlide);
    if (this.isLastSlide()) {
      return null;
    }

    this.currentSlide = this.currentSlide + 1;

    this.adjustTranslateForResize();
  }



  viewportNoWiderThan(thresholdInPx) {
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  resetStage(){
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




    //console.log("viewport: " + this.viewport + ", inView: " + this.inView + ", totalSlides: " + this.totalSlides);
  }

  adjustTranslateForResize() {
    console.log("adjustTranslateForResize()");

    if (this.isFirstSlide()) {
      console.log("isFirstSlide TRUE");
      this.$prevBtn.style.display = 'none';
    } else {
      console.log("isFirstSlide FALSE");
      this.$prevBtn.style.display = 'block';
    }

    if (this.isLastSlide()) {
      console.log("isLastSlide TRUE");
      this.$nextBtn.style.display = 'none';
    } else {
      console.log("isLastSlide FALSE");
      this.$nextBtn.style.display = 'block';
    }



    let carouselWidth = window.getComputedStyle(this.$elm).width.match(/([0-9\.]+)px/)[1];
    let currentSlide = this.currentSlide;
    let expectedOffset = (currentSlide - 1) * carouselWidth * -1;

    // working MOBILE, TABLET and DESKTOP:
    let nudge = (expectedOffset - (currentSlide -1) * 40) / this.inView;
    // console.log("nudge: ", nudge);

    this.moveableStage.style.transform = 'translate(' + nudge + 'px, 0)';

  }

  hideElm() {

    this.$elm.classList.add('visuallyhidden');

  }

  showElm() {

    this.$elm.classList.remove('visuallyhidden');

  }

};
