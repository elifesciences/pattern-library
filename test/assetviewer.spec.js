let expect = chai.expect;

// load in component(s) to be tested
let AssetViewer = require('../assets/js/components/AssetViewer');

describe('An AssetViewer Component', () => {
  'use strict';
  let $elm;
  let assetViewer;

  beforeEach(() => {
    $elm = document.querySelector('[data-behaviour="AssetViewer"]');
    assetViewer = new AssetViewer($elm, window, window.document);
  });

  afterEach(() => {
    $elm = null;
    assetViewer = null;
  });

  it('exists', () => {
    expect(assetViewer).to.exist;
  });

  it('shows the primary asset first', () => {
    expect(assetViewer).to.exist;
    expect($elm.classList.contains('visuallyhidden')).to.be.false;
    expect(document.querySelector('#figs1').classList.contains('visuallyhidden')).to.be.true;
  });

  it('shows a new asset item', () => {
    assetViewer.show(1);
    expect($elm.classList.contains('visuallyhidden')).to.be.true;
    expect(document.querySelector('#figs1').classList.contains('visuallyhidden')).to.be.false;
  });

});
