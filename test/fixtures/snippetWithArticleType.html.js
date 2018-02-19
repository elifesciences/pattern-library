const snippetWithNoArticleType = require('./snippetWithNoArticleType.html');

module.exports = (type) => {
  'use strict';

  const $snippet = snippetWithNoArticleType();
  $snippet.dataset.articleType = type;
  return $snippet;
};
