'use strict';

module.exports = class AboutProfiles {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.$elm.classList.add('grid-listing');
    [].forEach.call(this.$elm.querySelectorAll('li'), (item) => {
      item.classList.add('grid-listing-item');
    });
  }

};
