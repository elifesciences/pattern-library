const snippetWithNoItemType = require('./snippetWithNoItemType.html');
const utils = require('../../assets/js/libs/elife-utils')();

module.exports = (itemType, isItemTypeOnDescendant) => {
  'use strict';

  const setItemType = ($elm, itemType) => {
    $elm.dataset.itemType = itemType;
    return $elm;
  };

  const $snippet = snippetWithNoItemType();

  if (isItemTypeOnDescendant) {
    return setItemType(utils.buildElement('div', [], '', $snippet), itemType);
  }

  return setItemType($snippet, itemType);
};
