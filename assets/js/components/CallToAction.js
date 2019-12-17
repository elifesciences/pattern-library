'use strict';

const Dismiss = require('../actions/Dismiss');

module.exports = class CallToAction {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.dismiss = new Dismiss(this.$elm, '.call-to-action', this.doc);
    this.$elm.addEventListener('click', () => this.dismiss.setCookie());
    this.show();
  }

  show() {
    this.$elm.classList.add('call-to-action-wrapper--js-shown');
  }

};
