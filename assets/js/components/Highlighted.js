'use strict';
var utils = require('../libs/elife-utils')();

console.log("Highlighted.js - a");

module.exports = class Highlighted {

  constructor($elm, _window = window, doc = document) {

    if (!($elm instanceof HTMLElement)) {
      return;
    }

    console.log($elm);

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

    // this.moveableStage = this.$elm.querySelectorAll('.listing-list');
    // this.originalSlideWrappers = this.moveableStage.querySelectorAll('.listing-list__item');
    //this.originalSlideCount = this.originalSlideWrappers.length;
    //this.currentSlideCount = this.originalSlideCount;

    //console.log("$elm: ", this.$elm);
    //console.log("moveableStage: ", this.moveableStage);
    //console.log("originalSlideWrappers: ", this.originalSlideWrappers);
    //console.log("originalSlideCount: ", this.originalSlideCount);
    //console.log("currentSlideCount: ", this.currentSlideCount);

    //this.adjustTranslateForResize();

    // this.window.addEventListener('resize', () => {
    //   this.updateWidth();
    //   this.adjustTranslateForResize();
    // });

    this.switchBreakpoint();
    this.window.addEventListener('resize',
      utils.debounce(() => this.switchBreakpoint(), 100)
    );


    prevBtn.addEventListener('click', () => {

      this.currentSlide === 1 ? this.currentSlide = 1 : this.currentSlide -= 1;
      //this.updateButtons();

      console.log("prevBtn click", this.currentSlide);

      this.slidePrev();
      this.adjustTranslateForResize();

    });


    nextBtn.addEventListener('click', () => {

      this.currentSlide === this.maxSlide ? this.currentSlide = this.maxSlide : this.currentSlide += 1;
      //this.updateButtons();

      console.log("nextBtn click", this.currentSlide);

      this.slideNext();
      this.adjustTranslateForResize();

    });

  }

  viewportNoWiderThan(thresholdInPx) {
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  resetStage(){
    //console.log("resetStage()");
    this.moveableStage.style.transform = 'translate(0px, 0)';
    this.currentSlide = 1;
  }

  switchBreakpoint() {

    this.resetStage();

    if (this.viewportNoWiderThan(this.tabletWidth)) {

      this.viewport = "MOBILE";
      this.inView = 1;
      this.maxSlide = 5;

      this.switchToMobilePosition();

    } else if (this.viewportNoWiderThan(this.desktopWidth)) {

      this.viewport = "TABLET";
      this.inView = 2;
      this.maxSlide = 4;

      this.switchToTabletPosition();

    } else {

      this.viewport = "DESKTOP";
      this.inView = 3;
      this.maxSlide = 3;

      this.switchToDesktopPosition();
    }

    console.log("viewport: " + this.viewport + ", inView: " + this.inView + ", totalSlides: " + this.totalSlides);
  }

  switchToMobilePosition() {
    //console.log("MOBILE");
  }

  switchToTabletPosition() {
    //console.log("TABLET");
  }

  switchToDesktopPosition() {
    //console.log("DESKTOP");
  }

  slideNext(){
    //console.log("slideNext");
  }

  slidePrev(){
    //console.log("slidePrev");
  }

  adjustTranslateForResize() {

    console.log("currentSlide: ", this.currentSlide);

    console.log("Highlighted.js - adjustTranslateForResize()");

    let carouselWidth = window.getComputedStyle(this.$elm).width.match(/([0-9\.]+)px/)[1];
    let currentSlide = this.currentSlide;
    let expectedOffset = (currentSlide - 1) * carouselWidth * -1;
    //this.moveableStage.style.transform = 'translate(' + (expectedOffset / this.inView) + 'px, 0)';

    console.log("carouselWidth: " + carouselWidth + ", currentSlide: " + currentSlide + ", expectedOffset: " + expectedOffset + ", this.inView: " + this.inView);
    //MOBILE: let increment = expectedOffset / this.inView;
    //TABLET: let increment = (expectedOffset / this.inView) - ((currentSlide - 1) * 20);
    // DESKTOP: let increment = ((expectedOffset + 80 )/ this.inView) - ((currentSlide - 1) * 40);
    let increment = expectedOffset / this.inView;
    console.log("increment: ", increment);

    this.moveableStage.style.transform = 'translate(' + increment + 'px, 0)';


  }


  updateButtons(){
    //console.log("updateButtons");


    if(this.currentSlide == 1) {

      console.log("currentSlide :first ", this.currentSlide);
      //this.hideBtn();


    } else if(this.currentSlide == this.region) {

      console.log("currentSlide :last ", this.currentSlide);
      //this.hideBtn();


    } else {

      console.log("currentSlide", this.currentSlide);

    }

  }

  hideBtn(e){

    //console.log("hideBtn", e);

  }

  showBtn(e){

    //console.log("showBtn", e);

  }

  // updateWidth() {
  //
  //   console.log("Highlighted.js - updateWidth()");
  //
  //   this.moveableStage.style.width = utils.adjustPxString(
  //     this.window.getComputedStyle(this.$elm).width, this.currentSlideCount, 'multiply');
  // }

};
