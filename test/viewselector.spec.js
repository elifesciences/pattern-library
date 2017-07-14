let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let ViewSelector = require('../assets/js/components/ViewSelector');

describe('A ViewSelector Component', function () {
  'use strict';
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="ViewSelector"]');
  });

  afterEach(function () {
    [].forEach.call($elm.querySelectorAll('.view-selector__list-item--side-by-side'), ($li) => {
      $li.remove();
    });
  });

  it('uses the "view-selector--fixed" css class', function () {
    let viewSelector = new ViewSelector($elm);
    expect(viewSelector.cssFixedClassName).to.equal('view-selector--fixed');
  });

  describe('the "view-selector--fixed" class', function () {

    it('is added when sufficient scrolling has occurred', function () {
      // Fake sufficient scrolling
      let windowMock = {
        addEventListener: function () {
        },
        pageYOffset: 20
      };
      let _viewSelector1 = new ViewSelector($elm, windowMock);
      _viewSelector1.elmYOffset = 20;
      _viewSelector1.handleScrolling();

      let classes1 = _viewSelector1.$elm.classList;
      expect(classes1.contains('view-selector--fixed')).to.be.true;

      let _viewSelector2 = new ViewSelector($elm, windowMock);
      _viewSelector2.elmYOffset = 20;
      _viewSelector2.handleScrolling();

      let classes2 = _viewSelector2.$elm.classList;
      expect(classes2.contains('view-selector--fixed')).to.be.true;
    });

    it('is removed when scrolling is insufficient', function () {
      // Fake sufficient scrolling
      let windowMock = {
        addEventListener: function () {
        },
        pageYOffset: 10
      };
      let _viewSelector = new ViewSelector($elm, windowMock);
      _viewSelector.elmYOffset = 20;
      _viewSelector.handleScrolling();

      let classes = _viewSelector.$elm.classList;
      expect(classes.contains('view-selector--fixed')).to.be.false;

    });

    it('is removed when scrolling would cause view selector to overlay following layout elements',
       function () {
         // This must be smaller than $elm.offsetHeight of the object under test
         let fakeBottomOfMainEl = 20;
         let windowMock = {
           addEventListener: function () {
           },
           pageYOffset: 30
         };

         let _viewSelector = new ViewSelector($elm, windowMock, document);
         _viewSelector.mainTarget = {
           getBoundingClientRect: function () {
             return {
               bottom: fakeBottomOfMainEl
             };
           }
         };
         _viewSelector.elmYOffset = 20;
         // Prerequisite for the test to be valid
         expect(fakeBottomOfMainEl).to.be.below(_viewSelector.$elm.offsetHeight);

         _viewSelector.$elm.classList.add('view-selector--fixed');
         _viewSelector.handleScrolling();
         expect(_viewSelector.$elm.classList.contains('view-selector--fixed')).to.be.true;
         expect(_viewSelector.$elm.style.top.indexOf('px')).to.be.above(-1);
       });

  });

  it('has a toggleable list of jump links', function () {
    let viewSelector = new ViewSelector($elm);
    expect(viewSelector.$jumpLinksList instanceof HTMLElement).to.be.true;
    expect(viewSelector.toggleJumpLinks).to.be.a('function');
  });

  describe("its toggleable list of jump links", function () {

    let viewSelector;

    beforeEach(function () {
      viewSelector = new ViewSelector($elm);
    });

    it('expands when toggled open', function () {
      viewSelector.$jumpLinksList.classList.add('visuallyhidden');
      viewSelector.$jumpLinksToggle.classList.add('view-selector__jump_links_header--closed');
      viewSelector.toggleJumpLinks();
      expect(viewSelector.$jumpLinksList.classList.contains('visuallyhidden')).to.be.false;
      expect(viewSelector.$jumpLinksToggle.classList
                         .contains('view-selector__jump_links_header--closed')).to.be.false;
    });

    it('collapses when toggled closed', function () {
      viewSelector.$jumpLinksList.classList.remove('visuallyhidden');
      viewSelector.$jumpLinksToggle.classList.remove('view-selector__jump_links_header--closed');
      viewSelector.toggleJumpLinks();
      expect(viewSelector.$jumpLinksList.classList.contains('visuallyhidden')).to.be.true;
      expect(viewSelector.$jumpLinksToggle.classList
                         .contains('view-selector__jump_links_header--closed')).to.be.true;
    });

    describe('a jump link', () => {

      let sectionHeadings;
      beforeEach(() => {
        sectionHeadings = [

        ];
      });

      context('when its linked section is the top-most in view', () => {

        xit('is highlighted');

      });

      context('when its linked section is not the top-most in view', () => {

        xit('is not highlighted');

      });

    });

  });

  describe('its side-by-side link', function () {

    let viewSelector;

    beforeEach(() => {
      window.CSS = {
        supports: () => true
      };
      viewSelector = new ViewSelector($elm);
    });

    context('when the browser can display the side by side view', () => {

      it('is displayed on load', function () {
        const link = $elm.querySelector('.view-selector__link--side-by-side');
        expect(link).to.not.be.null;
        expect(link.textContent).to.equal('Side by side');
        expect(link.href).to.equal('https://lens.elifesciences.org/19749/index.html');
      });

      it('opens an iframe', function () {
        const link = $elm.querySelector('.view-selector__link--side-by-side');
        link.click();
        expect(viewSelector.sideBySideView.$iframe).to.not.be.undefined;
        expect(viewSelector.sideBySideView.$iframe.classList.contains('hidden')).to.be.false;
      });

    });

    context('when the browser cannot display the side by side view', () => {

      it('is not displayed if the link is not supplied', function () {
        $elm.dataset.sideBySideLink = '';
        expect(viewSelector.sideBySideViewAvailable()).to.be.false;
      });

      it('is not displayed if the link looks broken', function () {
        $elm.dataset.sideBySideLink = 'localhost/null';
        expect(viewSelector.sideBySideViewAvailable()).to.be.false;
      });

      it('is not displayed if the browser is probably Edge or IE', function () {
        // Explicity fail the capability check used to determine whether the link is displayed
        window.CSS.supports = (property, value) => {
          if (property === 'text-orientation' || property === '-webkit-text-orientation') {
            if (value === 'sideways') {
              return false;
            }
          }
          return true;
        };

        expect(new ViewSelector($elm, window).sideBySideViewAvailable()).to.be.false;

        window.CSS.supports = null;
        expect(new ViewSelector($elm, window).sideBySideViewAvailable()).to.be.false;

        window.CSS = null;
        expect(new ViewSelector($elm, window).sideBySideViewAvailable()).to.be.false;
      });

    });
  });

  it('maintains a list of top level article section headings', () => {
    const expectedHeadingList = ['headingOne', 'headingTwo'];
    const doc = {
      querySelectorAll: () => {
        return expectedHeadingList;
      }
    };
    spy(doc, 'querySelectorAll');
    const headingList = ViewSelector.getAllCollapsibleSectionHeadings(doc);
    expect(doc.querySelectorAll.calledWithExactly('[data-behaviour="ArticleSection"] > .article-section__header .article-section__header_text')).to.be.true;
    expect(headingList).to.have.length(2);
    expect(headingList).to.equal(expectedHeadingList);
    doc.querySelectorAll.restore();
  });

  describe('its knowledge of the section headings', () => {

    const headingList = [
      {
        getBoundingClientRect: () => {

        }
      }
    ];

    it('can identify the first section heading in view', () => {

    });

  });

});
