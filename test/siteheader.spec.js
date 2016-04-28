let expect = chai.expect;

// load in component(s) to be tested
let SiteHeader = require('../assets/js/components/SiteHeader');

describe('A SiteHeader Component', function () {
  'use strict';
  let $elm;
  let siteHeader;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="SiteHeader"]');
    siteHeader = new SiteHeader($elm);
  });

  afterEach(function () {
    $elm = null;
    siteHeader = null;
  });

  it('exists', function () {
    expect(siteHeader).to.exist;
  });


});
