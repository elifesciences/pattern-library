let expect = chai.expect;

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
        addEventListener: function (){},
        pageYOffset: 20
      };
      let _viewSelector1 = new ViewSelector($elm, windowMock);
      _viewSelector1.elmYOffset = 20;
      _viewSelector1.handleScroll();

      let classes1 = _viewSelector1.$elm.classList;
      expect(classes1.contains('view-selector--fixed')).to.be.true;

      let _viewSelector2 = new ViewSelector($elm, windowMock);
      _viewSelector2.elmYOffset = 20;
      _viewSelector2.handleScroll();

      let classes2 = _viewSelector2.$elm.classList;
      expect(classes2.contains('view-selector--fixed')).to.be.true;
    });

    it('is removed when scrolling is insufficient', function () {
      // Fake sufficient scrolling
      let windowMock = {
        addEventListener: function (){},
        pageYOffset: 10
      };
      let _viewSelector = new ViewSelector($elm, windowMock);
      _viewSelector.elmYOffset = 20;
      _viewSelector.handleScroll();

      let classes = _viewSelector.$elm.classList;
      expect(classes.contains('view-selector--fixed')).to.be.false;

    });

    it('is removed when scrolling would cause view selector to overlay following layout elements',
       function () {
         // This must be smaller than $elm.offsetHeight of the object under test
         let fakeBottomOfMainEl = 20;
         let windowMock = {
           addEventListener: function (){},
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
         expect (fakeBottomOfMainEl).to.be.below(_viewSelector.$elm.offsetHeight);

         _viewSelector.$elm.classList.add('view-selector--fixed');
         _viewSelector.handleScroll();
         expect(_viewSelector.$elm.classList.contains('view-selector--fixed')).to.be.true;
         expect(_viewSelector.$elm.style.top.indexOf('px')).to.be.above(-1);
       });

  });

  it('has a toggleable list of jump links', function () {
    let viewSelector = new ViewSelector($elm);
    expect(viewSelector.$jumpLinks instanceof HTMLElement).to.be.true;
    expect(viewSelector.toggleJumpLinks).to.be.a('function');
  });

  describe("its toggleable list of jump links", function () {

    let viewSelector;

    beforeEach(function () {
      viewSelector = new ViewSelector($elm);
    });

    it('expands when toggled open', function () {
      viewSelector.$jumpLinks.classList.add('visuallyhidden');
      viewSelector.$jumpLinksToggle.classList.add('view-selector__jump_links_header--closed');
      viewSelector.toggleJumpLinks();
      expect(viewSelector.$jumpLinks.classList.contains('visuallyhidden')).to.be.false;
      expect(viewSelector.$jumpLinksToggle.classList
                         .contains('view-selector__jump_links_header--closed')).to.be.false;
    });

    it('collapses when toggled closed', function () {
      viewSelector.$jumpLinks.classList.remove('visuallyhidden');
      viewSelector.$jumpLinksToggle.classList.remove('view-selector__jump_links_header--closed');
      viewSelector.toggleJumpLinks();
      expect(viewSelector.$jumpLinks.classList.contains('visuallyhidden')).to.be.true;
      expect(viewSelector.$jumpLinksToggle.classList
                         .contains('view-selector__jump_links_header--closed')).to.be.true;
    });


  });

  describe('its side-by-side link', function () {

    let viewSelector;

    beforeEach(function () {
      viewSelector = new ViewSelector($elm);
    });

    it('is displayed on load', function() {
      const link = $elm.querySelector('.view-selector__link--side-by-side');
      expect(link).to.not.be.null;
      expect(link.textContent).to.equal('Side-by-side view');
      expect(link.href).to.equal('https://lens.elifesciences.org/19749/index.html');
    });

    it('opens an iframe', function() {
      const link = $elm.querySelector('.view-selector__link--side-by-side');
      link.click();
      expect(viewSelector.sideBySideView.$iframe).to.not.be.undefined;
      expect(viewSelector.sideBySideView.$iframe.classList.contains('hidden')).to.be.false;
    });

    it('is not displayed if the link is empty', function () {
      $elm.dataset.sideBySideLink = '';
      expect(viewSelector.sideBySideViewAvailable()).to.be.false;
    });

    it('is not displayed if the link is broken', function () {
      $elm.dataset.sideBySideLink = 'localhost/null';
      expect(viewSelector.sideBySideViewAvailable()).to.be.false;
    });
  });

});
