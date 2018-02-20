const utils = require('../../assets/js/libs/elife-utils')();

module.exports = () => {
  'use strict';
  const $div = utils.buildElement('div', ['global-wrapper']);
  $div.dataset.behaviour = 'FragmentHandler Math';
  return $div;
};
