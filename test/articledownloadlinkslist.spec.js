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
    spy(articleDownloadLinksList.$elm, 'setAttribute');
  });

  afterEach(function() {
    articleDownloadLinksList.$elm.setAttribute.restore();
  });

  describe('The open method', function () {

    it('sets aria-expanded attribute to "true"', function () {
      articleDownloadLinksList.open();
      expect(articleDownloadLinksList.$elm.setAttribute.calledWithExactly('aria-expanded', "true")).to.be.true;
    })

    it('removes the class "visuallyhidden"', function () {
      articleDownloadLinksList.open();
      expect(articleDownloadLinksList.$elm.classList.contains('visuallyhidden')).to.be.false;
    });

  });

  describe('The close method', function () {

    it('sets aria-expanded attribute to "false"', function () {
      articleDownloadLinksList.close();
      expect(articleDownloadLinksList.$elm.setAttribute.calledWithExactly('aria-expanded', "false")).to.be.true;
    });

    it('adds the class "visuallyhidden"', function () {
      articleDownloadLinksList.close();
      expect(articleDownloadLinksList.$elm.classList.contains('visuallyhidden')).to.be.true;
    });

  });

});