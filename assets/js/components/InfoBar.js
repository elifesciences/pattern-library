'use strict';

const Dismiss = require('../actions/Dismiss');

module.exports = class InfoBar {
  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.dismiss = new Dismiss(this.$elm, this.$elm.querySelector('.info-bar__container'), this.doc);
  }

};
