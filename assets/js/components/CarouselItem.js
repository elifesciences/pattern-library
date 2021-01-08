'use strict';

module.exports = class Carousel {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;

    this.$elm.insertAdjacentHTML('afterbegin', this.$elm.dataset.image);

  }

};
