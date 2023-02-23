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

  it('has additional margin when scroll bar is visible', function () {
    let _contentAside = new ContentAside($elm);
    let scrollbarWidth = 17;
    _contentAside.addAdditionalMarginIfScrollBarIsVisible(scrollbarWidth);
    expect(_contentAside.$elm.style.marginRight).to.be.equal('-17px');
  });

    it('has zero margin when scroll bar is not visible', function () {
    let _contentAside = new ContentAside($elm);
    let scrollbarWidth = 0;
    _contentAside.addAdditionalMarginIfScrollBarIsVisible(scrollbarWidth);
    expect(_contentAside.$elm.style.marginRight).to.be.equal('0px');
  });
});
