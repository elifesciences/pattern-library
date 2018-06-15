'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class CookieOverlay {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    try {
      this.domain = this.window.elifeConfig.domain;
    } catch (e) {
      this.domain = 'elifesciences.org';
      utils.logError(this.window, e, 'Domain configuration failed');
    }

    this.cookieString = null;

    if (this.previouslyAccepted()) {
      return;
    }

    const message = 'This site uses cookies to deliver its services and analyse traffic. By using ' +
                    'this site, you agree to its use of cookies. <a href="https://elifesciences.org/privacy">Learn more</a>.';
    this.$overlay = this.buildDOM(message);
    this.doc.querySelector('body').appendChild(this.$overlay);
  }

  previouslyAccepted() {
    return !!utils.getCookieValue('cookieNotificationAccepted', this.doc.cookie);
  }

  accept() {
    this.$overlay.parentNode.removeChild(this.$overlay);
    const expiryDate = 'Tue, 19 January 2038 03:14:07 UTC';
    this.cookieString = `cookieNotificationAccepted=true; expires=${expiryDate}; path=/; domain=${this.domain};`;
    this.doc.cookie = this.cookieString;
  }

  buildDOM(message) {
    const $root = utils.buildElement('div', ['opt-in-message-bar']);
    utils.buildElement('div', ['opt-in-message-bar__message'], message, $root);

    const $buttonWrapper = utils.buildElement('div', ['opt-in-message-bar__button_wrapper'], '', $root);
    const $button = utils.buildElement('button', ['button', 'button--default', 'button--small'], 'Got it', $buttonWrapper);

    $button.addEventListener('click', () => {
      this.accept();
    });

    return $root;
  }

};
