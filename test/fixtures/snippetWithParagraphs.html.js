const utils = require('../../assets/js/libs/elife-utils')();
const buildElement = utils.buildElement;

module.exports = (count) => {
  'use strict';

  const $root = buildElement('div');
  const $articleSection = buildElement('div', ['article-section'], '', $root);
  const $articleSectionBody = buildElement('div', ['article-section__body'], '', $articleSection);
  if (!count) {
    return $root;
  }

  for (let i = 0; i < count; i += 1) {
    buildElement('p', [], `Paragraph ${i}`, $articleSectionBody);
  }

  return $root;
};
