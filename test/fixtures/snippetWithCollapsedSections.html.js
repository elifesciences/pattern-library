const utils = require('../../assets/js/libs/elife-utils')();
const buildElement = utils.buildElement;

module.exports = (requestedCount) => {
  'use strict';

  const $root = buildElement('div', ['.content-container']);

  let count = 1;
  if (typeof requestedCount === 'number' && requestedCount >= 0) {
    count = Math.floor(requestedCount);
  }

  for (let i = 0; i < count; i += 1) {
    buildElement('div', ['article-section', 'article-section--js', 'article-section--collapsed'], `Paragraph ${i + 1}`, $root);
  }

  return $root;
};
