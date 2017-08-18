'use strict';

module.exports = class FilterPanel {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.$button = $elm.querySelector('button');

    if (!this.$button.form) {
      return;
    }

    this.$button.classList.add('visuallyhidden');
    this.$filters = $elm.querySelectorAll('input[type="checkbox"]');

    [].forEach.call(this.$filters, ($filter) => {
      $filter.addEventListener('change', () => $filter.form.submit());
    });
  }

};
