'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class Meta {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.window.addEventListener('load', () => {
      utils.removeSeparatorFromLastOnLine(this.$elm, '.meta > *', 'no-separator');
    });

    this.window.addEventListener('resize', () => {
      utils.removeSeparatorFromLastOnLine(this.$elm, '.meta > *', 'no-separator');
    });
  }
};
