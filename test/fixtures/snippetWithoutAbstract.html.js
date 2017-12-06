const utils = require('../../assets/js/libs/elife-utils')();


module.exports = () => {
  'use strict';

  const $root = utils.buildElement('div', ['wrapper-content']);
  const $gridItem = utils.buildElement('div', ['grid__item'],'',
                      utils.buildElement('div', ['grid'], '', $root));

  const articleSectionCount = 3;
  for(let i = 0; i < articleSectionCount; i += 1) {
    const $section = utils.buildElement('div', ['article-section'], '', $gridItem);
    if (i === articleSectionCount - 1) {
      utils.buildElement('p', [], '', $section)
    }
  }

  return $root;

};
