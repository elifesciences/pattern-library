'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class StatisticCollection {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    console.log('eho');

    utils.removeSeparatorFromLastOnLine(this.$elm, '.statistic-collection__item', 'no-separator');

    this.window.addEventListener('resize', () => {
      utils.removeSeparatorFromLastOnLine(this.$elm, '.statistic-collection__item', 'no-separator');
    });
  }
};
