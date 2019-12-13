'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class DismissButton {
  constructor($parent, $patternRoot, cookies) {

    this.cookieName = DismissButton.deriveCookieName($patternRoot);
    if (!this.cookieName.length || this.hasPreviouslyBeenDismissed(this.cookieName, cookies)) {
      //this.hide();
      return;
    }

    this.$button = this.buildButton($parent);
    this.$button.addEventListener('click', this.handleInteraction.bind(this));
  }

  static deriveCookieName($elm) {
    const cookieNameRoot = $elm.dataset.cookieNameRoot;
    if ($elm.id && $elm.id.length && cookieNameRoot && cookieNameRoot.length) {
      return `${cookieNameRoot}${$elm.id}`;
    }

    return '';
  }

  hasPreviouslyBeenDismissed(cookieName, cookies) {
    return utils.getCookieValue(cookieName, cookies) === 'true';
  }

  buildButton($parent) {
    const $button = utils.buildElement(
      'button',
      ['dismiss-button'],
      '',
      $parent);
    $button.setAttribute('aria-label', 'Dismiss this');
    return $button;
  }

  setCookie() {

  }

  dismiss() {

  }

  handleInteraction() {
    this.dismiss();
    this.setCookie();
  }

};
