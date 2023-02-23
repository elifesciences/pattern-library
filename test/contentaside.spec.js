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

  it('has additional margin and padding when scroll bar is visible', function () {
    let _contentAside = new ContentAside($elm);
    let scrollbarWidth = 17;
    _contentAside.addAdditionalSpaceIfScrollBarIsVisible(scrollbarWidth);
    expect(_contentAside.$elm.style.marginRight).to.be.equal('-17px');
    expect(_contentAside.$elm.style.paddingRight).to.be.equal('4px');
  });

    it('has zero margin and padding when scroll bar is not visible', function () {
    let _contentAside = new ContentAside($elm);
    let scrollbarWidth = 0;
    _contentAside.addAdditionalSpaceIfScrollBarIsVisible(scrollbarWidth);
    expect(_contentAside.$elm.style.marginRight).to.be.equal('0px');
    expect(_contentAside.$elm.style.paddingRight).to.be.equal('0px');
  });
});
