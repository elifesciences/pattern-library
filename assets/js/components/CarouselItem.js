'use strict';

module.exports = class Carousel {

  constructor($elm) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.$elm.insertAdjacentHTML('afterbegin', this.$elm.dataset.image);
  }

};
