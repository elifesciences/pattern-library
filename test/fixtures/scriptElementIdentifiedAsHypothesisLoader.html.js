const utils = require('../../assets/js/libs/elife-utils')();

module.exports = () => {
  'use strict';
  const $parent = utils.buildElement('div');
  const $script = utils.buildElement('script', [], '', $parent);
  $script.id = 'hypothesisEmbedder';
  return $parent;
};
