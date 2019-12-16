'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class DismissAndRemember {
  constructor($parent, $patternRoot, cookies, cookieExpiry) {

    this.cookieName = DismissAndRemember.deriveCookieName($patternRoot);
    if (this.hasPreviouslyBeenDismissed(this.cookieName, cookies)) {
      // TODO: hide $patternRoot (incl hide from AT)
      return;
    }

    this.cookieExpiry = cookieExpiry;
    this.$button = this.buildButton($parent);
  }

  static deriveCookieName($elm) {
    const cookieNameRoot = $elm.dataset.cookieNameRoot;
    if ($elm.id && $elm.id.length && cookieNameRoot && cookieNameRoot.length) {
      return `${cookieNameRoot}${$elm.id}`;
    }

    return '';
  }

  hasPreviouslyBeenDismissed(cookieName, cookies) {
    return cookieName && cookieName.length && utils.getCookieValue(cookieName, cookies) === 'true';
  }

  buildButton($parent) {
    const $button = utils.buildElement(
      'button',
      ['dismiss-button'],
      '',
      $parent);
    $button.setAttribute('aria-label', 'Dismiss this');
    $button.addEventListener('click', this.handleInteraction.bind(this));
    return $button;
  }

  setCookie(name) {
    this.cookieString = `${name}=true; expires=${this.cookieExpiry}; path=/;`;
    this.doc.cookie = this.cookieString;
  }

  dismiss() {

  }

  handleInteraction() {
    this.dismiss();
    this.setCookie(this.cookieName);
  }

};
