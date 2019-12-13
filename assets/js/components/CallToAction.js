'use strict';

const DismissAndRemember = require('../actions/DismissAndRemember');

module.exports = class CallToAction {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    const cookieExpiry = 'Tue, 19 January 2038 03:14:07 UTC';
    this.dismissAndRemember = new DismissAndRemember('.call-to-action', this.$elm, this.doc.cookie, cookieExpiry);
    this.$elm.addEventListener('click', () => this.dismissAndRemember.setCookie(this.cookieName));
    this.show();
  }

  dismiss() {
    this.hide();
    this.dismissAndRemember.setCookie(this.cookieName);
  }

  hide() {
    this.$elm.classList.remove('call-to-action-wrapper--js-shown');
  }

  show() {
    this.$elm.classList.add('call-to-action-wrapper--js-shown');
  }

};
