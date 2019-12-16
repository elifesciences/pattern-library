'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class Dismiss {
  constructor($parent, $toDismiss, document, cookieExpiry) {
    this.$toDismiss = $toDismiss;
    this.doc = document;
    this.cookieName = Dismiss.deriveCookieName(this.$toDismiss);
    if (this.hasPreviouslyBeenDismissed(this.cookieName, this.doc.cookie)) {
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

  setCookie() {
    if (this.cookieName && this.cookieName.length) {
      this.doc.cookie = `${this.cookieName}=true; expires=${this.cookieExpiry}; path=/;`;
    }
  }

  dismiss() {

  }

  handleInteraction() {
    this.dismiss();
    this.setCookie(this.cookieName);
  }

};
