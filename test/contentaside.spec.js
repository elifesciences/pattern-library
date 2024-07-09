'use strict';

const expect = chai.expect;
const spy = sinon.spy;

// load in component(s) to be tested
let ContentAside = require('../assets/js/components/ContentAside');

describe('A ContentAside Component', function () {
  let $elmOneVor;
  let $elmMoreVor;
  let $oldVor;

  beforeEach(function () {
    $elmOneVor = document.getElementById('one-article-version');
    $elmMoreVor = document.getElementById('more-article-versions');
    $oldVor = document.getElementById('old-vor');
  });

  it('uses the "content-aside__sticky" css class', function () {
    let contentAside = new ContentAside($elmOneVor);
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

    let _contentAside = new ContentAside($elmOneVor, windowMock);
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
    it('should hide all dt and dd elements except the first one (selected latest version) with class definition-list--vor and its next dd', function () {
      let _contentAside = new ContentAside($elmOneVor);

      const dtElements = _contentAside.$elm.querySelectorAll('dt');
      const ddElements = _contentAside.$elm.querySelectorAll('dd');

      for (let i = 0; i < dtElements.length; i += 1) {
        const dt = dtElements[i];
        const dd = ddElements[i];

        if (dt.classList.contains('definition-list--active')) {
          expect(dt.classList.contains('hidden')).to.be.false;
          expect(dd.classList.contains('hidden')).to.be.false;
        } else {
          expect(dt.classList.contains('hidden')).to.be.true;
          expect(dd.classList.contains('hidden')).to.be.true;
        }
      }
    });

    it('should hide all dt and dd elements except the selected version (selected older version) with class definition-list--vor and its next dd', function () {
      let _contentAside = new ContentAside($elmMoreVor);

      const dtElements = _contentAside.$elm.querySelectorAll('dt');
      const ddElements = _contentAside.$elm.querySelectorAll('dd');

      for (let i = 0; i < dtElements.length; i += 1) {
        const dt = dtElements[i];
        const dd = ddElements[i];

        if (dt.classList.contains('definition-list--active')) {
          expect(dt.classList.contains('hidden')).to.be.false;
          expect(dd.classList.contains('hidden')).to.be.false;
        } else {
          expect(dt.classList.contains('hidden')).to.be.true;
          expect(dd.classList.contains('hidden')).to.be.true;
        }
      }
    });

    it('should show the first dt and dd elements and hide others', function () {
      let _contentAside = new ContentAside($oldVor);

      const dtElements = _contentAside.$elm.querySelectorAll('dt');
      const ddElements = _contentAside.$elm.querySelectorAll('dd');

      for (let i = 0; i < dtElements.length; i += 1) {
        const dt = dtElements[i];
        const dd = ddElements[i];

        if (i === 0) {
          expect(dt.classList.contains('hidden')).to.be.false;
          expect(dd.classList.contains('hidden')).to.be.false;
        } else {
          expect(dt.classList.contains('hidden')).to.be.true;
          expect(dd.classList.contains('hidden')).to.be.true;
        }
      }
    });

    it('should ensure only one element with class "toggle" exists', function () {
      let _contentAside = new ContentAside($elmOneVor);
      const toggles = _contentAside.$elm.querySelectorAll('.toggle');
      expect(toggles.length).to.equal(1);
    });

    it('should add "toggle--expanded" class on clicking the toggle button', function () {
      let _contentAside = new ContentAside($elmOneVor);
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
      const _contentAside = new ContentAside($elmOneVor, winFake);

      setTimeout(() => {
        const secondItem = _contentAside.$elm.querySelectorAll('.contextual-data__item')[1];
        expect(secondItem.classList.contains('no-separator')).to.be.true;
        const itemsWithNoSeparator = _contentAside.$elm.querySelectorAll('.no-separator');
        expect(itemsWithNoSeparator.length).to.equal(1);
      }, 0);
    });

    it('should not add no-separator class when screen size narrow', () => {
      const winFake = buildFakeWindow(320, 320);
      const _contentAside = new ContentAside($elmOneVor, winFake);
      setTimeout(() => {
        const itemsWithNoSeparator = _contentAside.$elm.querySelectorAll('.no-separator');
        expect(itemsWithNoSeparator.length).to.equal(0);
      }, 0);
    });
  });
});
