let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let ArticleSection = require('../assets/js/components/ArticleSection');

describe('An Article Section (collapsible)', function () {
  'use strict';
  let $elm = document.querySelector('.article-section');
  let section;

  beforeEach(function () {
    section = new ArticleSection($elm);
  });

  afterEach(function () {
  });

  it('exists', function () {
    expect(section).to.not.equal(null);
  });

  it('is not initialised if it possesses the css class "article-section--first"', function () {
    $elm.classList.add('article-section--first');
    let articleSection = new ArticleSection($elm);
    expect(articleSection.$headerLink).not.to.exist;
  });

  it('is initialised if it does not possess the css class "article-section--first"', function () {
    $elm.classList.remove('article-section--first');
    let articleSection = new ArticleSection($elm);
    expect(articleSection.$headerLink).to.be.instanceof(HTMLElement);
  });

  it('is initially closed if is initially closed is true', function () {
    $elm.dataset.isInitiallyClosed = 'true';
    let articleSection = new ArticleSection($elm);
    expect(articleSection.$headerLink.classList.contains('article-section__header_link')).to.be.true;
    expect(articleSection.$headerLink.classList.contains('article-section__header_link--closed')).to.be.true;
    expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.true;
  });

  it('is initially open if is initially closed not set to true', function () {
    let initialStateCandidateValues = ['open', 'shut', 'unavailable', 'null', '', 'false'];
    initialStateCandidateValues.forEach((value) => {
      $elm.dataset.isInitiallyClosed = value;
      let articleSection = new ArticleSection($elm);
      expect(articleSection.$headerLink.classList.contains('article-section__header_link')).to.be.true;
      expect(articleSection.$headerLink.classList.contains('article-section__header_link--closed')).to.be.false;
      expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.false;
    });
  });

  it('can toggle open state to closed state', function () {
    let eventMock = {
      preventDefault: function () {}
    };
    section.$headerLink.classList.remove('article-section__header_link--closed');
    section.$body.classList.remove('visuallyhidden');
    section.toggleState(eventMock);
    expect(section.$headerLink.classList.contains('article-section__header_link--closed')).to.be.true;
    expect(section.$body.classList.contains('visuallyhidden')).to.be.true;
  });

  it('can toggle closed state to open state', function () {
    let eventMock = {
      preventDefault: function () {}
    };
    section.$headerLink.classList.add('article-section__header_link--closed');
    section.$body.classList.add('visuallyhidden');
    section.toggleState(eventMock);
    expect(section.$headerLink.classList.contains('article-section__header_link--closed')).to.be.false;
    expect(section.$body.classList.contains('visuallyhidden')).to.be.false;
  });

});
