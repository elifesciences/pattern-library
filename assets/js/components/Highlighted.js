'use strict';
var utils = require('../libs/elife-utils')();

console.log("Highlighted.js - b");

module.exports = class Highlighted {

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

    const prevBtn = doc.querySelector('#trigger-prev');
    const nextBtn = doc.querySelector('#trigger-next');

    this.moveableStage = this.$elm.querySelector('.listing-list--highlighted');
    this.originalSlideWrappers = this.moveableStage.querySelectorAll('.listing-list__item');

    this.switchBreakpoint();
    this.window.addEventListener('resize',
      utils.debounce(() => this.switchBreakpoint(), 100)
    );

    prevBtn.addEventListener('click', () => {
      this.currentSlide === 1 ? this.currentSlide = 1 : this.currentSlide -= 1;
      this.adjustTranslateForResize();
    });

    nextBtn.addEventListener('click', () => {
      this.currentSlide === this.maxSlide ? this.currentSlide = this.maxSlide : this.currentSlide += 1;
      this.adjustTranslateForResize();
    });

  }

  viewportNoWiderThan(thresholdInPx) {
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  resetStage(){
    this.moveableStage.style.transform = 'translate(0px, 0)';
    this.currentSlide = 1;
  }

  switchBreakpoint() {

    utils.equalizeHeightOfItems('listing-list--highlighted', 'teaser__header');

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

    console.log("viewport: " + this.viewport + ", inView: " + this.inView + ", totalSlides: " + this.totalSlides);
  }

  adjustTranslateForResize() {

    let carouselWidth = window.getComputedStyle(this.$elm).width.match(/([0-9\.]+)px/)[1];
    let currentSlide = this.currentSlide;
    let expectedOffset = (currentSlide - 1) * carouselWidth * -1;

    // working MOBILE, TABLET and DESKTOP:
    let nudge = (expectedOffset - (currentSlide -1) * 40) / this.inView;
    // console.log("nudge: ", nudge);

    this.moveableStage.style.transform = 'translate(' + nudge + 'px, 0)';

  }

};
