let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let ArticleSection = require('../assets/js/components/ArticleSection');

describe('An Article Section (collapsible)', function () {
  'use strict';
  let $elm = document.querySelector('.article-section');
  let section;

  function createWindowMock(viewport, hash = '', userAgent = '') {
    return {
      matchMedia: (media) => {
        const match = media.match(/\d+/).map(i => Number(i))[0];
        return {
          matches: (viewport <= match),
        };
      },
      location: {
        hash: hash ? `#${hash}` : '',
      },
      addEventListener: function () {
      },
      navigator: {
        userAgent: userAgent,
      }
    };
  }

  function createDocumentMock(referrer = null) {
    return {
      createElement: (tagName, options) => document.createElement(tagName, options),
      getElementById: (id) => document.getElementById(id),
      referrer: referrer,
    };
  }

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
    expect(articleSection.$toggle).not.to.exist;
  });

  it('is initialised if it does not possess the css class "article-section--first"', function () {
    $elm.classList.remove('article-section--first');
    let articleSection = new ArticleSection($elm);
    expect(articleSection.$toggle).to.be.instanceof(HTMLElement);
  });

  it('is initially closed if initial state is closed', function () {
    $elm.dataset.initialState = 'closed';
    let articleSection = new ArticleSection($elm);
    expect(articleSection.$toggle.classList.contains('article-section__toggle')).to.be.true;
    expect(articleSection.$toggle.classList.contains('article-section__toggle--closed')).to.be.true;
    expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.true;
  });

  it('is initially opened if the user agent is Googlebot', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(600, '', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    const articleSection = new ArticleSection($elm, windowMock);
    expect(articleSection.$toggle.classList.contains('article-section__toggle')).to.be.true;
    expect(articleSection.$toggle.classList.contains('article-section__toggle--closed')).to.be.false;
    expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.false;
  });

  it('is initially closed if the user agent is not Googlebot', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(600, '', 'Mozilla/5.0 (compatible)');
    const articleSection = new ArticleSection($elm, windowMock);
    expect(articleSection.$toggle.classList.contains('article-section__toggle')).to.be.true;
    expect(articleSection.$toggle.classList.contains('article-section__toggle--closed')).to.be.true;
    expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.true;
  });

  it('is initially opened if the referrer is Google', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(600);
    const documentMock = createDocumentMock('https://www.google.com/');
    const articleSection = new ArticleSection($elm, windowMock, documentMock);
    expect(articleSection.$toggle.classList.contains('article-section__toggle')).to.be.true;
    expect(articleSection.$toggle.classList.contains('article-section__toggle--closed')).to.be.false;
    expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.false;
  });

  it('is initially closed if the referrer is not Google', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(600);
    const documentMock = createDocumentMock('https://www.example.com/');
    const articleSection = new ArticleSection($elm, windowMock, documentMock);
    expect(articleSection.$toggle.classList.contains('article-section__toggle')).to.be.true;
    expect(articleSection.$toggle.classList.contains('article-section__toggle--closed')).to.be.true;
    expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.true;
  });

  it('is initially opened if initial state is closed but the fragment is the section', function () {
    $elm.dataset.initialState = 'closed';
    let windowMock = createWindowMock(600, 'introduction');
    let articleSection = new ArticleSection($elm, windowMock);
    expect(articleSection.$toggle.classList.contains('article-section__toggle')).to.be.true;
    expect(articleSection.$toggle.classList.contains('article-section__toggle--closed')).to.be.false;
    expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.false;
  });

  it('is initially opened if initial state is closed but the fragment is inside the section', function () {
    $elm.dataset.initialState = 'closed';
    let windowMock = createWindowMock(600, 'foo');
    let articleSection = new ArticleSection($elm, windowMock);
    expect(articleSection.$toggle.classList.contains('article-section__toggle')).to.be.true;
    expect(articleSection.$toggle.classList.contains('article-section__toggle--closed')).to.be.false;
    expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.false;
  });

  it('is initially closed if initial state is closed and the fragment is something else', function () {
    $elm.dataset.initialState = 'closed';
    let windowMock = createWindowMock(600, 'bar');
    let articleSection = new ArticleSection($elm, windowMock);
    expect(articleSection.$toggle.classList.contains('article-section__toggle')).to.be.true;
    expect(articleSection.$toggle.classList.contains('article-section__toggle--closed')).to.be.true;
    expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.true;
  });

  it('is initially open if initial state is not set to closed and viewport is wide enough', function () {
    let initialStateCandidateValues = ['open', 'shut', 'unavailable', 'null', '', 'false'];
    let windowMock = createWindowMock(999);
    initialStateCandidateValues.forEach((value) => {
      $elm.dataset.initialState = value;
      let articleSection = new ArticleSection($elm, windowMock);
      expect(articleSection.$toggle.classList.contains('article-section__toggle')).to.be.true;
      expect(articleSection.$toggle.classList.contains('article-section__toggle--closed')).to.be.false;
      expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.false;
    });
  });

  it('is initially closed if viewport is not wide enough, regardless of initial state', function () {
    let initialStateCandidateValues = ['open', 'shut', 'unavailable', 'null', '', 'false', 'closed'];
    let windowMock = createWindowMock(600);
    initialStateCandidateValues.forEach((value) => {
      $elm.dataset.initialState = value;
      let articleSection = new ArticleSection($elm, windowMock);
      expect(articleSection.$toggle.classList.contains('article-section__toggle')).to.be.true;
      expect(articleSection.$toggle.classList.contains('article-section__toggle--closed')).to.be.true;
      expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.true;
    });
  });

  it('is initially open if viewport is wide enough, regardless of initial state', function () {
    let initialStateCandidateValues = ['open', 'shut', 'unavailable', 'null', '', 'false', 'closed'];
    let windowMock = createWindowMock(1200);
    initialStateCandidateValues.forEach((value) => {
      $elm.dataset.initialState = value;
      let articleSection = new ArticleSection($elm, windowMock);
      expect(articleSection.$toggle.classList.contains('article-section__toggle')).to.be.true;
      expect(articleSection.$toggle.classList.contains('article-section__toggle--closed')).to.be.false;
      expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.false;
    });
  });

  it('can toggle open state to closed state', function () {
    let eventMock = {
      preventDefault: function () {}
    };
    section.$toggle.classList.remove('article-section__toggle--closed');
    section.$body.classList.remove('visuallyhidden');
    section.toggleState(eventMock);
    expect(section.$toggle.classList.contains('article-section__toggle--closed')).to.be.true;
    expect(section.$body.classList.contains('visuallyhidden')).to.be.true;
  });

  it('can toggle closed state to open state', function () {
    let eventMock = {
      preventDefault: function () {}
    };
    section.$toggle.classList.add('article-section__toggle--closed');
    section.$body.classList.add('visuallyhidden');
    section.toggleState(eventMock);
    expect(section.$toggle.classList.contains('article-section__toggle--closed')).to.be.false;
    expect(section.$body.classList.contains('visuallyhidden')).to.be.false;
  });

});
