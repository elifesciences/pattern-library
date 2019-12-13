'use strict';

const DismissAndRemember = require('../actions/DismissAndRemember');

module.exports = class InfoBar {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    const cookieExpiry = 'Tue, 19 January 2038 03:14:07 UTC';

    new DismissAndRemember('.info-bar__container', this.$elm, this.doc.cookie, cookieExpiry);
  }
};
