'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class CallToAction {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.cookieName = CallToAction.deriveCookieName(this.$elm);
    if (!this.cookieName.length) {
      return;
    }

    this.$button = CallToAction.buildDismissButton();
    this.$elm.addEventListener('click', this.handleInteraction.bind(this));

    if (this.hasAlreadyBeenSeen(this.cookieName)) {
      this.hide();
    }

  }

  static deriveCookieName($elm) {
    if ($elm.id && $elm.id.length) {
      return `callToAction_${$elm.id}`;
    }

    return '';
  }

  dismiss() {
    this.hide();
    this.setCookie(this.cookieName);
  }

  setCookie(name) {
    const expiryDate = 'Tue, 19 January 2038 03:14:07 UTC';
    this.cookieString = `${name}=true; expires=${expiryDate}; path=/;`;
    this.doc.cookie = this.cookieString;
  }

  hasAlreadyBeenSeen(cookieName) {
    return utils.getCookieValue(cookieName, this.doc.cookie) === 'true';
  }

  hide() {
    this.$elm.classList.add('hidden');
  }

  handleInteraction(e) {
    if (e.target.classList.contains('call-to-action__button')) {
      this.setCookie(this.cookieName);
    } else if (e.target.classList.contains('call-to-action__close') ||
               e.target.parentElement.classList.contains('call-to-action__close')) {
      this.dismiss();
    }
  }

  static buildDismissButton() {
    const $buttonRoot = utils.buildElement(
      'button',
      ['call-to-action__close'],
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

};
