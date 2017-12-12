const utils = require('../../assets/js/libs/elife-utils')();

module.exports = () => {
  'use strict';

  const $root = utils.buildElement('div', ['root']);
  const $abstract = utils.buildElement('div', [], '', $root);
  $abstract.id = 'abstract';

  const $followsAbstract = utils.buildElement('div', [], '', $root);
  $followsAbstract.id = 'nextFollowingElementSiblingAfterAbstract';
  utils.buildElement('div', ['article-section__body'], '', $followsAbstract);

  const $distantFromAbstract = utils.buildElement('div', [], '', $root);
  $distantFromAbstract.id = 'nextFollowingElementSiblingAfterAbstract';
  utils.buildElement('div', ['article-section__body'], '', $distantFromAbstract);

  return $root;

};
