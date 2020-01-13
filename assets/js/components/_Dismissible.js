'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class Dismissible {
  constructor($toDismiss, attachPoint, document) {
    this.$toDismiss = $toDismiss;
    this.doc = document;

    this.cookieName = Dismissible.deriveCookieName(this.$toDismiss);
    if (this.hasCookieName(this.cookieName) && this.hasPreviouslyBeenDismissed(this.cookieName, this.doc.cookie)) {
      this.hide();
      return;
    }

    this.cookieExpiryDate = Dismissible.deriveCookieExpiryDate(this.$toDismiss);
    this.$button = this.buildButton(attachPoint);
  }

  static deriveCookieExpiryDate($elm) {
    if ($elm.dataset.cookieExpires) {
      return $elm.dataset.cookieExpires;
    }

    const defaultDurationDays = 365;
    const durationDays = parseInt($elm.dataset.cookieDuration, 10) || defaultDurationDays;
    const expiryDate = new Date(new Date());
    expiryDate.setDate(expiryDate.getDate() + durationDays);
    return expiryDate;
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

  hasCookieName(cookieName) {
    return cookieName && cookieName.length;
  }

  buildButton($parent) {
    const $button = utils.buildElement(
      'button',
      ['dismiss-button'],
      '',
      $parent);
    $button.setAttribute('aria-label', 'Dismiss this');
    $button.addEventListener('click', this.dismiss.bind(this));
    return $button;
  }

  setCookie() {
    if (this.cookieName && this.cookieName.length) {
      this.doc.cookie = `${this.cookieName}=true; expires=${this.cookieExpiryDate}; path=/;`;
    }
  }

  hide() {
    this.$toDismiss.classList.add('hidden');
  }

  dismiss() {
    this.hide();
    this.setCookie();
  }

};
