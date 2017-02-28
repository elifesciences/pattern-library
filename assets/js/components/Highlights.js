'use strict';
var utils = require('../libs/elife-utils')();

console.log('Highlights.js - F');

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
    this.maxOffset;

    var body = document.querySelector('body');
    body.addEventListener('keyup', this.checkTabPress.bind(this));

    // this.activeElement = doc.activeElement;
    // this.focused = doc.hasFocus();
  }

  // checkPageFocus() {
  //   let slide1 = this.doc.getElementById("slide1");
  //   let slide2 = this.doc.getElementById("slide2");
  //   let slide3 = this.doc.getElementById("slide3");
  //   let slide4 = this.doc.getElementById("slide4");
  //   let slide5 = this.doc.getElementById("slide5");
  //
  //   if ( slide2.focus() ) {
  //     slide2.innerHTML = "The document has the focus.";
  //   } else {
  //     slide2.innerHTML = "The document doesn't have the focus.";
  //   }
  // }

  checkTabPress(e) {
    "use strict";

    e = e || event;
    let activeElement;
    if (e.keyCode == 9) {

      activeElement = document.activeElement;

      let slide = this.currentSlide;
      let maxOffset = this.maxOffset;
      console.log("checkTabPress: ", activeElement);

      if ( activeElement.tagName.toLowerCase() == 'a' && activeElement.classList.contains('teaser__header_text_link') ) {

        console.log("h4");

        if(this.currentSlide == 1){
          this.resetStage();
        }

        if(slide >= 1 && slide <= maxOffset) {

          if (e.shiftKey) {
            console.log('SHIFT + TAB:' + this.currentSlide + ", slide: " + this.currentSlide + ", maxOffset: " + this.maxOffset);
            this.currentSlide = this.currentSlide - 1;
            this.goToSlide(slide);
          } else {
            console.log('TAB:', this.currentSlide + ", slide: " + this.currentSlide + ", maxOffset: " + this.maxOffset);
            this.currentSlide = this.currentSlide + 1;
            this.goToSlide(slide);
          }

        }


      }


    }

    // if (e.shiftKey && e.keyCode == 9) {
    //   // Here read the active selected link.
    //   activeElement = document.activeElement;
    //   // If HTML element is and anchor
    //   if ( activeElement.tagName.toLowerCase() == 'a' && activeElement.classList.contains('teaser__header_text_link') ) {
    //
    //     // get it's hyperlink
    //     // alert(activeElement.href);
    //     console.log("checkTabPress: ", activeElement);
    //
    //     let slide = this.currentSlide;
    //     let maxOffset = this.maxOffset;
    //     console.log("slide: ", this.currentSlide);
    //     console.log("maxOffset: ", this.maxOffset);
    //
    //
    //     if(slide >= 1 && slide <= maxOffset) {
    //       this.goToSlide(slide);
    //       this.currentSlide = this.currentSlide - 1;
    //     }
    //
    //   }
    // }
  }

  // deactivateCurrentSlide() {
  //   console.info('currentSlide', this.originalSlideWrappers[this.currentSlide - 1], this);
  //   //return this.currentSlide <= 1;
  //
  //   var prevCurr = this.originalSlideWrappers[this.currentSlide - 1].classList.remove('is-active');
  //
  //   return prevCurr;
  //
  // }
  //
  // activateCurrentSlide() {
  //   console.info('currentSlide', this.originalSlideWrappers[this.currentSlide - 1], this);
  //   //return this.currentSlide <= 1;
  //
  //   var newCurr = this.originalSlideWrappers[this.currentSlide - 1].classList.add('is-active');
  //
  //   return newCurr;
  //
  // }

  isFirstSlide() {
    return this.currentSlide <= 1;
  }

  isLastSlide() {
    return this.currentSlide >= (this.maxOffset);
  }

  previousButton() {

    //this.deactivateCurrentSlide();

    if (this.isFirstSlide()) {
      return null;
    }

    this.currentSlide = this.currentSlide - 1;
    this.adjustTranslateForResize();

    console.log('previousButton() currentSlide:', this.currentSlide);
  }

  nextButton() {

    //this.deactivateCurrentSlide();

    if (this.isLastSlide()) {
      return null;
    }

    this.currentSlide = this.currentSlide + 1;
    this.adjustTranslateForResize();

    console.log('nextButton() currentSlide:', this.currentSlide);
  }

  viewportNoWiderThan(thresholdInPx) {
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  resetStage() {
    this.moveableStage.style.transform = 'translate(0px, 0)';
    this.currentSlide = 1;

    this.$prevBtn.style.display = 'none';
    this.$nextBtn.style.display = 'block';


    console.log('resetStage() currentSlide:', this.currentSlide);
  }

  switchBreakpoint() {

    utils.equalizeHeightOfItems('listing-list--highlights', 'teaser__header');

    this.resetStage();

    //console.log('currentSlide', this.currentSlide);

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

    //this.deactivatePreviousSlide();
    //this.activateCurrentSlide();

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

    console.log("this.currentSlide");
    let slide = this.currentSlide;
    this.goToSlide(slide);

  }

  goToSlide(thisSlide) {
    console.log("goToSlide()", thisSlide);

    let carouselWidth = window.getComputedStyle(this.$elm).width.match(/([0-9\.]+)px/)[1];
    let expectedOffset = (thisSlide - 1) * carouselWidth * -1;
    let nudge = (expectedOffset - (thisSlide - 1) * 40) / this.inView;

    this.moveableStage.style.transform = 'translate(' + nudge + 'px, 0)';
  }

  hideElm() {

    this.$elm.classList.add('visuallyhidden');

  }

  showElm() {

    this.$elm.classList.remove('visuallyhidden');

  }

};
