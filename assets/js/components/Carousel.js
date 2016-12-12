'use strict';

module.exports = class Carousel {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;

    // 1-indexed not 0-indexed as will be used as a multiplier
    this.currentSlide = 1;
    this.slideCount = this.$elm.querySelectorAll('.carousel__item').length;
    this.moveableStage = this.$elm.querySelector('.carousel__items');

    // Set width based on number of items available.
    this.moveableStage.style.width = (this.slideCount * 100) + 'vw';
    this.$elm.querySelector('.carousel__control--previous').addEventListener(
                                                                          'click',
                                                                          this.previous.bind(this));
    this.$elm.querySelector('.carousel__control--next').addEventListener(
                                                                          'click',
                                                                          this.next.bind(this));

    // TODO: move controls from mustache to js.
  }

  next() {
    if (this.currentSlide < this.slideCount) {
      this.updateSlide();
      this.currentSlide += 1;
    }
  }

  previous() {
    if (this.currentSlide > 1) {
      this.updateSlide('previous');
      this.currentSlide -= 1;
    }
  }

  getCurrentOffset() {
    let offsetStringMatch = this.moveableStage.style.transform.match(/translateX\((.*)vw\)/);
    if (!offsetStringMatch) {
      return 0;
    }

    return this.window.parseInt(offsetStringMatch[1], 10);
  }

  updateSlide(direction) {
    let currentOffset = this.getCurrentOffset();
    let newOffset = direction === 'previous' ? currentOffset + 100 : currentOffset - 100;

    // TODO: Consider updating utils with this forumlation (vw) for translation adjustment
    this.moveableStage.style.transform = 'translateX(' + newOffset + 'vw)';
  }

};
