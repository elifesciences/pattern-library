'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class DismissButton {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.cookieName = DismissButton.deriveCookieName(this.$elm);
    if (!this.cookieName.length || this.hasPreviouslyBeenDismissed(this.cookieName)) {
      this.hide();
      return;
    }

    // Will need to change buildDismissButton as more than one button to call
    this.$button = DismissButton.buildButton();
  }

  static deriveCookieName($elm) {
    const cookieNameRoot = $elm.dataset.cookieNameRoot;
    if ($elm.id && $elm.id.length && cookieNameRoot && cookieNameRoot.length) {
      return `${cookieNameRoot}${$elm.id}`;
    }

    return '';
  }

  hasPreviouslyBeenDismissed(cookieName) {
    return utils.getCookieValue(cookieName, this.doc.cookie) === 'true';
  }

  static buildButton() {
    const $buttonRoot = utils.buildElement(
      'button',
      ['call-to-action__dismiss'],
      '',
      '.call-to-action',
      '.call-to-action__button_wrapper');
    utils.buildElement(
      'span',
      ['visuallyhidden'],
      'Dismiss this call to action',
      $buttonRoot);
    return $buttonRoot;
  }

  setCookie() {

  }

  dismiss() {

  }

};
