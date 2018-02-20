const snippetWithNoItemType = require('./snippetWithNoItemType.html');

module.exports = (type) => {
  'use strict';

  const $snippet = snippetWithNoItemType();
  $snippet.dataset.itemType = type;
  return $snippet;
};
