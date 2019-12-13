'use strict';

const DismissButton = require('./DismissButton');

module.exports = class InfoBar {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    new DismissButton('.info-bar__container', $elm, this.doc.cookie);

  }
};
