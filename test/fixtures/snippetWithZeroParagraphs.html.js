const utils = require('../../assets/js/libs/elife-utils')();
const buildElement = utils.buildElement;

module.exports = () => {
  'use strict';

  const $root = buildElement('div');

  buildElement('div', [], 'First', $root);

  const $articleSection = buildElement('div', ['article-section'], '', $root);
  const $articleSectionBody = buildElement('div', ['article-section__body'], '', $articleSection);
  buildElement('div', [], 'Second', $articleSectionBody);
  buildElement('div', [], 'Third', $articleSectionBody);
  buildElement('div', [], 'Fourth', $articleSectionBody);
  buildElement('div', [], 'Fifth', $articleSectionBody);

  return $root;

};
