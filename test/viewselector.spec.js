let expect = chai.expect;

// load in component(s) to be tested
let ViewSelector = require('../assets/js/components/ViewSelector');

describe('A ViewSelector Component', function () {
  'use strict';
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="ViewSelector"]');
  });

  it('uses the css class named "view-selector--fixed"', function () {
    let viewSelector = new ViewSelector($elm);
    expect(viewSelector.cssFixedClassName).to.equal('view-selector--fixed');
  });

  it('adds the class when sufficient scrolling has occurred', function () {
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

  it('removes the class when scrolling is insufficient', function () {
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

  it('removes the class when scrolling would cause it to overlay following layout elements',
  function () {
    // This must be smaller than $elm.offsetHeight of the object under test
    let fakeBottomOfMainEl = 20;
    let docMock = {
      querySelector: function () {
        return {
          getBoundingClientRect: function () {
            return {
              bottom: fakeBottomOfMainEl
            };
          }
        };
      }
    };
    let windowMock = {
      addEventListener: function (){},
      pageYOffset: 30
    };

    let _viewSelector = new ViewSelector($elm, windowMock, docMock);
    _viewSelector.elmYOffset = 20;
    // Prerequisite for the test to be valid
    expect (fakeBottomOfMainEl).to.be.below(_viewSelector.$elm.offsetHeight);

    _viewSelector.$elm.classList.add('view-selector--fixed');
    _viewSelector.handleScroll();
    expect(_viewSelector.$elm.classList.contains('view-selector--fixed')).to.be.true;
    expect(_viewSelector.$elm.style.top.indexOf('px')).to.be.above(-1);
  });

});
