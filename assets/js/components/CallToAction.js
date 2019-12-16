'use strict';

const Dismiss = require('../actions/Dismiss');

module.exports = class CallToAction {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    const dismissUntil = 'Tue, 19 January 2038 03:14:07 UTC';
    this.dismiss = new Dismiss(this.$elm, dismissUntil, '.call-to-action', this.doc);
    this.$elm.addEventListener('click', () => this.dismiss.setCookie());
    this.show();
  }

  dismiss() {
    this.hide();
    this.dismiss.setCookie();
  }

  hide() {
    this.$elm.classList.remove('call-to-action-wrapper--js-shown');
  }

  show() {
    this.$elm.classList.add('call-to-action-wrapper--js-shown');
  }

};
