const utils = require('../../assets/js/libs/elife-utils')();
const buildElement = utils.buildElement;

module.exports = () => {
  'use strict';

  const $root = buildElement('div');

  buildElement('p', [], 'First', $root);

  const $articleSection = buildElement('div', ['article-section'], '', $root);
  const $articleSectionBody = buildElement('div', ['article-section__body'], '', $articleSection);
  buildElement('p', [], 'Second', $articleSectionBody);
  buildElement('p', [], 'Third', $articleSectionBody);
  buildElement('p', [], 'Fourth', $articleSectionBody);
  buildElement('p', [], 'Fifth', $articleSectionBody);

  return $root;

};
