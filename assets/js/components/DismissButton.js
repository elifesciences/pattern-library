'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class DismissButton {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.cookieName = DismissButton.deriveCookieName(this.$elm);
    // if (!this.cookieName.length || this.hasAlreadyBeenSeen(this.cookieName)) {
    //   this.hide();
    //   return;
    // }
  }

  static deriveCookieName($elm) {
    const cookieNameRoot = $elm.dataset.cookieNameRoot;
    if ($elm.id && $elm.id.length && cookieNameRoot && cookieNameRoot.length) {
      return `${cookieNameRoot}${$elm.id}`;
    }

    return '';
  }

  buildButton() {

  }

  setCookie() {

  }

  dismiss() {

  }

};
