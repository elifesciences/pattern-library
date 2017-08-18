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
    FilterPanel.setupEventListeners(FilterPanel.findFilters(this.$elm));
  }

  static setupEventListeners(filters) {
    [].forEach.call(filters, ($filter) => {
      if (!$filter.form) {
        return;
      }

      $filter.addEventListener('change', () => $filter.form.submit());
    });
  }

  static findFilters($elm) {
    return $elm.querySelectorAll('input[type="checkbox"]');
  }

};
