'use strict';

const Dismiss = require('../actions/Dismiss');

module.exports = class InfoBar {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    const cookieExpiry = 'Tue, 19 January 2038 03:14:07 UTC';

    new Dismiss(this.$elm, cookieExpiry, '.info-bar__container', this.doc);
  }
};
