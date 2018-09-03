const utils = require('../../assets/js/libs/elife-utils')();

module.exports = () => {
  'use strict';
  const baseSectionClasses = ['article-section', 'article-section--js'];
  const $root = utils.buildElement('div', ['root', 'content-container']);
  utils.buildElement('div', baseSectionClasses.concat('article-section--first'), '', $root);

  const $secondSection = utils.buildElement('div', [baseSectionClasses], '', $root);
  $secondSection.id = 'secondSection';
  utils.buildElement('div', ['article-section__body'], '', $secondSection);

  const $thirdSection = utils.buildElement('div', [baseSectionClasses], '', $root);
  $thirdSection.id = 'thirdSection';
  utils.buildElement('div', ['article-section__body'], '', $thirdSection);

  return $root;

};
