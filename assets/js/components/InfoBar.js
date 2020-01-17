'use strict';

const Dismissible = require('./_Dismissible');

module.exports = class InfoBar {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.dismissible = new Dismissible(this.$elm, this.$elm.querySelector('.info-bar__container'), this.doc);
  }

};
