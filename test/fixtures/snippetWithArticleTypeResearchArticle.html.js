const utils = require('../../assets/js/libs/elife-utils')();

module.exports = () => {
  'use strict';

  const $head = utils.buildElement('head');
  const $someMeta = utils.buildElement('meta', [], '', $head);
  $someMeta.setAttribute('name', 'dc.type');
  $someMeta.setAttribute('content', 'Research Article');

  return $head;

};
