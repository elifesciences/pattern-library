const snippetWithNoArticleType = require('./snippetWithNoArticleType.html');

module.exports = () => {
  'use strict';

  const $snippet = snippetWithNoArticleType();
  $snippet.dataset.articleType = 'research-article';
  return $snippet;
};
