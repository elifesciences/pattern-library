'use strict';

let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let ContentAside = require('../assets/js/components/ContentAside');

describe('A ContentAside Component', function () {
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="ContentAside"]');
  });

  it('uses the "content-aside__sticky" css class', function () {
    let contentAside = new ContentAside($elm);
    expect(contentAside.cssStickyClassName).to.equal('content-aside__sticky');
  });

  it('adds and removes the "content-aside__sticky" class as the page is scrolled', function () {
    let windowMock = {
      addEventListener: function () {},
      matchMedia: function () {
        return {
          matches: true
        };
      }
    };

    let _contentAside = new ContentAside($elm, windowMock);
    expect(_contentAside.$elm.classList.contains('content-aside__sticky')).to.be.false;

    // Note: The 'onScroll' handler is mocked, hence scroll and then manually call the handler.
    window.scrollTo(0, 1080);
    _contentAside.handleScrolling();
    expect(_contentAside.$elm.classList.contains('content-aside__sticky')).to.be.true;

    // Note: The 'onScroll' handler is mocked, hence scroll and then manually call the handler.
    window.scrollTo(0, 0);
    _contentAside.handleScrolling();
    expect(_contentAside.$elm.classList.contains('content-aside__sticky')).to.be.false;
  });
});
