'use strict';

const DismissAndRemember = require('../actions/DismissAndRemember');

module.exports = class InfoBar {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    new DismissAndRemember('.info-bar__container', $elm, this.doc.cookie);

  }
};
