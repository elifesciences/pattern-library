let expect = chai.expect;

// load in component(s) to be tested
let ArticleDownloadLinksList = require('../assets/js/components/ArticleDownloadLinksList');

describe('An ArticleDownloadLinksList Component', function () {
  "use strict";

  let $el = document.querySelector('[data-behaviour="ArticleDownloadLinksList"]');
  let articleDownloadLinksList;

  beforeEach(function () {
    articleDownloadLinksList = new ArticleDownloadLinksList($el, window, window.document);
  });

  it('exists', function () {
    expect(articleDownloadLinksList).to.exist;
  });

});
