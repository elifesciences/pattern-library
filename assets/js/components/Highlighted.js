'use strict';
var utils = require('../libs/elife-utils')();

console.log("Highlighted.js - 1");

module.exports = class Highlighted {

  constructor($elm, _window = window, doc = document) {

    if (!($elm instanceof HTMLElement)) {
      return;
    }

    console.log($elm);

    this.window = _window;
    this.$elm = $elm;
    this.doc = doc;

    const prevBtn = doc.querySelector('#trigger-prev');
    const nextBtn = doc.querySelector('#trigger-next');

    this.moveableStage = this.$elm.querySelector('.listing-list--highlighted');
    this.originalSlideWrappers = this.moveableStage.querySelectorAll('.listing-list__item');

    // this.moveableStage = this.$elm.querySelectorAll('.listing-list');
    // this.originalSlideWrappers = this.moveableStage.querySelectorAll('.listing-list__item');
    //this.originalSlideCount = this.originalSlideWrappers.length;
    //this.currentSlideCount = this.originalSlideCount;

    console.log("$elm: ", this.$elm);
    console.log("moveableStage: ", this.moveableStage);
    console.log("originalSlideWrappers: ", this.originalSlideWrappers);
    //console.log("originalSlideCount: ", this.originalSlideCount);
    //console.log("currentSlideCount: ", this.currentSlideCount);


    //this.adjustTranslateForResize();

    // this.window.addEventListener('resize', () => {
    //   this.updateWidth();
    //   this.adjustTranslateForResize();
    // });

    prevBtn.addEventListener('click', () => {

      this.currentSlide == 1 ? this.currentSlide = 1 : this.currentSlide -= 1;

      console.log("prevBtn click", this.currentSlide);

      this.downOne();
      this.adjustTranslateForResize();

    });

    nextBtn.addEventListener('click', () => {

      this.currentSlide == 5 ? this.currentSlide = 5 : this.currentSlide += 1;

      console.log("nextBtn click", this.currentSlide);

      this.upOne();
      this.adjustTranslateForResize();

    });



    this.init();



  }

  upOne(){
    console.log("upOne");
  }

  downOne(){
    console.log("downOne");
  }

  init() {
    this.currentSlide = 1;
    this.timerInterval = 10000;

    console.log("Highlighted.js - init()");
    console.log("currentSlide", this.currentSlide);

  }

  adjustTranslateForResize() {



    console.log("Highlighted.js - adjustTranslateForResize()");

    let carouselWidth = window.getComputedStyle(this.$elm).width.match(/([0-9\.]+)px/)[1];
    let currentSlide = this.currentSlide;
    let expectedOffset = (currentSlide - 1) * carouselWidth * -1;
    this.moveableStage.style.transform = 'translate(' + expectedOffset + 'px, 0)';
  }



  // updateWidth() {
  //
  //   console.log("Highlighted.js - updateWidth()");
  //
  //   this.moveableStage.style.width = utils.adjustPxString(
  //     this.window.getComputedStyle(this.$elm).width, this.currentSlideCount, 'multiply');
  // }

};
