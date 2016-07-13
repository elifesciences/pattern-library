'use strict';

module.exports = class SelectNav {

  constructor($elm) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.$elm.classList.add('select-nav--js');
    this.$elm.querySelector('select').addEventListener('change', this.triggerSubmit.bind(this));
  }

  triggerSubmit() {
    this.$elm.submit();
  }

};
