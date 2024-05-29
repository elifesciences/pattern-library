'use strict';

const expect = chai.expect;
const spy = sinon.spy;

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
      },
      pageYOffset: 100
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

  describe('with Timeline', function () {
    it('should ensure only one element with class "toggle" exists', function () {
      let _contentAside = new ContentAside($elm);
      const toggles = _contentAside.$elm.querySelectorAll('.toggle');
      expect(toggles.length).to.equal(1);
    });

    it('should add "toggle--expanded" class on clicking the toggle button', function () {
      let _contentAside = new ContentAside($elm);
      const toggleButton = _contentAside.$elm.querySelector('.toggle');
      expect(toggleButton.parentElement.classList.contains('toggle--expanded')).to.be.false;

      toggleButton.click();
      expect(toggleButton.parentElement.classList.contains('toggle--expanded')).to.be.true;
    });
  });

  describe('with Contextual data', function () {
    const buildFakeWindow = function (height, width) {
      return {
        innerHeight: height,
        innerWidth: width,
        addEventListener: function () {},
      };
    };

    it('should add no-separator class to the second item when contextual data is on two lines', () => {
      const winFake = buildFakeWindow(250, 250);
      const _contentAside = new ContentAside($elm, winFake);

      setTimeout(() => {
        const secondItem = _contentAside.$elm.querySelectorAll('.contextual-data__item')[1];
        expect(secondItem.classList.contains('no-separator')).to.be.true;
        const itemsWithNoSeparator = _contentAside.$elm.querySelectorAll('.no-separator');
        expect(itemsWithNoSeparator.length).to.equal(1);
      }, 0);
    });

    it('should not add no-separator class when screen size narrow', () => {
      const winFake = buildFakeWindow(320, 320);
      const _contentAside = new ContentAside($elm, winFake);
      setTimeout(() => {
        const itemsWithNoSeparator = _contentAside.$elm.querySelectorAll('.no-separator');
        expect(itemsWithNoSeparator.length).to.equal(0);
      }, 0);
    });
  });
});
