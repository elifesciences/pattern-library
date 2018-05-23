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

    if (CookieOverlay.previouslyAccepted(this.doc)) {
      return;
    }

    const message = 'This site uses cookies from Google to deliver its services, to personalise ads ' +
                    'and to analyse traffic. Information about your use of this site is shared ' +
                    'with Google. By using this site, you agree to its use of cookies. ' +
                    '<a href="/privacy">Learn more</a>.';
    this.$overlay = this.buildDOM(message);
    this.doc.querySelector('body').appendChild(this.$overlay);
  }

  static previouslyAccepted(doc) {
    return !!utils.getCookieValue('cookieNotificationAccepted', doc.cookie);
  }

  buildDOM(message) {
    const $root = utils.buildElement('div', ['opt-in-message-bar']);
    utils.buildElement('div', ['opt-in-message-bar__message'], message, $root);

    const $buttonWrapper = utils.buildElement('div', ['opt-in-message-bar__button_wrapper'], '', $root);
    const $button = utils.buildElement('button', ['button', 'button--default', 'button--small'], 'Got it', $buttonWrapper);

    $button.addEventListener('click', () => {
      this.$overlay.parentNode.removeChild(this.$overlay);
      const expiryDate = 'Fri, 31 December 2038 23:59:59 GMT';
      this.doc.cookie = `cookieNotificationAccepted=true; expires=${expiryDate} path=/; domain=elifesciences.org;`;
    });

    return $root;
  }

};
