let expect = chai.expect;

require('../assets/js/libs/polyfills');

// load in component(s) to be tested
let AssetNavigation = require('../assets/js/components/AssetNavigation');

describe('An AssetNavigation Component', () => {
  'use strict';
  let $elm;
  let assetNavigation;

  beforeEach(() => {
    $elm = document.querySelector('[data-behaviour="AssetNavigation"]');
    assetNavigation = new AssetNavigation($elm, window, window.document);
  });

  afterEach(() => {
    $elm = null;
    assetNavigation = null;
  });

  it('exists', () => {
    expect(assetNavigation).to.exist;
  });

  /*
  Can't get PhantomJS to play nicely with promises. #itworksonmymachine

  it('shows the primary asset first', () => {
    expect(assetNavigation).to.exist;
    expect($elm.classList.contains('visuallyhidden')).to.be.false;
    expect(document.querySelector('#figs1').classList.contains('visuallyhidden')).to.be.true;
  });

  it('shows a new asset item', () => {
    assetNavigation.show(1);
    expect($elm.classList.contains('visuallyhidden')).to.be.true;
    expect(document.querySelector('#figs1').classList.contains('visuallyhidden')).to.be.false;
  });
  */

});
