'use strict';

const Dismissible = require('./_Dismissible');

module.exports = class CallToAction {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.dismissible = new Dismissible(this.$elm, '.call-to-action', this.doc);
    this.$elm.addEventListener('click', () => this.dismissible.dismiss());
    this.show();
  }

  show() {
    this.$elm.classList.add('call-to-action-wrapper--js-shown');
  }

};
