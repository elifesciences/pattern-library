const utils = require('../../assets/js/libs/elife-utils')();
const buildElement = utils.buildElement;

module.exports = (requestedCount) => {
  'use strict';

  const $root = buildElement('div');
  const $articleSection = buildElement('div', ['article-section'], '', $root);
  const $articleSectionBody = buildElement('div', ['article-section__body'], '', $articleSection);

  let count = 1;
  if (typeof requestedCount === 'number' && requestedCount >= 0) {
    count = Math.floor(requestedCount);
  }

  for (let i = 0; i < count; i += 1) {
    buildElement('p', [], `Paragraph ${i + 1}`, $articleSectionBody);
  }

  return $root;
};
