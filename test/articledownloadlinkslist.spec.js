const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;
const spy = sinon.spy;

let utils = require('../assets/js/libs/elife-utils')();

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

describe('ArticleDownloadLinksList Aria Expanded Test', function () {

  let generateAria

  beforeEach(function () {
    spy(window, "matchMedia");
  });

  afterEach(function () {
    window.matchMedia.restore();
  });

  context('ArticleDownloadLinksList is closed', function () {

    it('returns false', function () {
      expect(window.matchMedia.calledWithExactly('aria-expanded="false"'));
    });

  });


});
