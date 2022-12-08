let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let Collapsible = require('../assets/js/components/Collapsible');

describe('A Collapsible', function () {
  'use strict';
  let $elm = document.querySelector('.definition-list');
  let collapsible;

  function createWindowMock(viewport, userAgent = '') {
    return {
      matchMedia: (media) => {
        const match = media.match(/\d+/).map(i => Number(i))[0];
        return {
          matches: (viewport <= match),
        };
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
    collapsible = new Collapsible($elm, window, document);
  });

  it('exists', function () {
    expect(collapsible).to.not.equal(null);
  });

  it('is initially closed if initial state is closed', function () {
    $elm.dataset.initialState = 'closed';
    let collapsibleElement = new Collapsible($elm);
    expect(collapsibleElement.$toggle.classList.contains('toggle')).to.be.true;
    expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.true;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.true;
    });
  });

  it('is initially opened if the user agent is Googlebot and the viewport is small', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(600, 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    const collapsibleElement = new Collapsible($elm, windowMock);
    expect(collapsibleElement.$toggle.classList.contains('toggle')).to.be.true;
    expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.false;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.false;
    });
  });

  it('is initially opened if the user agent is Googlebot and the viewport is medium', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(999, 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
    const collapsibleElement = new Collapsible($elm, windowMock);
    expect(collapsibleElement.$toggle.classList.contains('toggle')).to.be.true;
    expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.false;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.false;
    });
  });

  it('is initially closed if the user agent is not Googlebot and the viewport is small', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(600, 'Mozilla/5.0 (compatible)');
    const collapsibleElement = new Collapsible($elm, windowMock);
    expect(collapsibleElement.$toggle.classList.contains('toggle')).to.be.true;
    expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.true;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.true;
    });
  });

  it('is initially closed if the user agent is not Googlebot and the viewport is medium', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(999, 'Mozilla/5.0 (compatible)');
    const collapsibleElement = new Collapsible($elm, windowMock);
    expect(collapsibleElement.$toggle.classList.contains('toggle')).to.be.true;
    expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.true;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.true;
    });
  });

  it('is initially opened if the referrer is Google and the viewport is small', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(600);
    const documentMock = createDocumentMock('https://www.google.com/');
    const collapsibleElement = new Collapsible($elm, windowMock, documentMock);
    expect(collapsibleElement.$toggle.classList.contains('toggle')).to.be.true;
    expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.false;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.false;
    });
  });

  it('is initially opened if the referrer is Google and the viewport is medium', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(999);
    const documentMock = createDocumentMock('https://www.google.com/');
    const collapsibleElement = new Collapsible($elm, windowMock, documentMock);
    expect(collapsibleElement.$toggle.classList.contains('toggle')).to.be.true;
    expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.false;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.false;
    });
  });

  it('is initially closed if the referrer is not Google and the viewport is small', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(600);
    const documentMock = createDocumentMock('https://www.example.com/');
    const collapsibleElement = new Collapsible($elm, windowMock, documentMock);
    expect(collapsibleElement.$toggle.classList.contains('toggle')).to.be.true;
    expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.true;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.true;
    });
  });

  it('is initially closed if the referrer is not Google and the viewport is medium', function () {
    $elm.dataset.initialState = 'closed';
    const windowMock = createWindowMock(999);
    const documentMock = createDocumentMock('https://www.example.com/');
    const collapsibleElement = new Collapsible($elm, windowMock, documentMock);
    expect(collapsibleElement.$toggle.classList.contains('toggle')).to.be.true;
    expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.true;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.true;
    });
  });

  it('is not initialized on wide viewport', function () {
    let initialStateCandidateValues = ['open', 'shut', 'unavailable', 'null', '', 'false'];
    let windowMock = createWindowMock(1000);
    initialStateCandidateValues.forEach((value) => {
      $elm.dataset.initialState = value;
      let collapsibleElement = new Collapsible($elm, windowMock);
      expect(collapsibleElement.$toggle).to.not.exist;
    });
  });

  it('is initially closed if viewport is small, regardless of initial state', function () {
    let initialStateCandidateValues = ['open', 'shut', 'unavailable', 'null', '', 'false', 'closed'];
    let windowMock = createWindowMock(600);
    initialStateCandidateValues.forEach((value) => {
      $elm.dataset.initialState = value;
      let collapsibleElement = new Collapsible($elm, windowMock);
      expect(collapsibleElement.$toggle.classList.contains('toggle')).to.be.true;
      expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.true;
      collapsibleElement.$collapsibleElements.forEach(function (elem) {
        expect(elem.classList.contains('visuallyhidden')).to.be.true;
      });
    });
  });

  it('is initially closed if viewport is medium, regardless of initial state', function () {
    let initialStateCandidateValues = ['open', 'shut', 'unavailable', 'null', '', 'false', 'closed'];
    let windowMock = createWindowMock(999);
    initialStateCandidateValues.forEach((value) => {
      $elm.dataset.initialState = value;
      let collapsibleElement = new Collapsible($elm, windowMock);
      expect(collapsibleElement.$toggle.classList.contains('toggle')).to.be.true;
      expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.true;
      collapsibleElement.$collapsibleElements.forEach(function (elem) {
        expect(elem.classList.contains('visuallyhidden')).to.be.true;
      });
    });
  });

  it('can toggle open state to closed state on small viewport', function () {
    let eventMock = {
      preventDefault: function () {}
    };
    let windowMock = createWindowMock(600);
    let collapsibleElement = new Collapsible($elm, windowMock);
    collapsibleElement.$toggle.classList.remove('toggle--closed');
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      elem.classList.remove('visuallyhidden');
    });
    collapsibleElement.toggleState(eventMock);
    expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.true;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.true;
    });
  });

  it('can toggle open state to closed state on medium viewport', function () {
    let eventMock = {
      preventDefault: function () {}
    };
    let windowMock = createWindowMock(999);
    let collapsibleElement = new Collapsible($elm, windowMock);
    collapsibleElement.$toggle.classList.remove('toggle--closed');
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      elem.classList.remove('visuallyhidden');
    });
    collapsibleElement.toggleState(eventMock);
    expect(collapsibleElement.$toggle.classList.contains('toggle--closed')).to.be.true;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.true;
    });
  });

  it('can toggle closed state to open state on small viewport', function () {
    let eventMock = {
      preventDefault: function () {}
    };
    let windowMock = createWindowMock(600);
    let collapsibleElement = new Collapsible($elm, windowMock);
    collapsibleElement.$toggle.classList.add('toggle--closed');
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      elem.classList.add('visuallyhidden');
    });
    collapsibleElement.toggleState(eventMock);
    expect(collapsibleElement.$toggle.classList.contains('article-section__toggle--closed')).to.be.false;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.false;
    });
  });

  it('can toggle closed state to open state on medium viewport', function () {
    let eventMock = {
      preventDefault: function () {}
    };
    let windowMock = createWindowMock(999);
    let collapsibleElement = new Collapsible($elm, windowMock);
    collapsibleElement.$toggle.classList.add('toggle--closed');
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      elem.classList.add('visuallyhidden');
    });
    collapsibleElement.toggleState(eventMock);
    expect(collapsibleElement.$toggle.classList.contains('article-section__toggle--closed')).to.be.false;
    collapsibleElement.$collapsibleElements.forEach(function (elem) {
      expect(elem.classList.contains('visuallyhidden')).to.be.false;
    });
  });

});
