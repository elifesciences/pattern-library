let expect = chai.expect;

// load in component(s) to be tested
let FilterPanel = require('../assets/js/components/FilterPanel');

describe('A FilterPanel', function () {
  'use strict';
  let $elm;
  let filterPanel;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="FilterPanel"]');
    filterPanel = new FilterPanel($elm, window, window.document);
  });

  it('exists', function () {
    expect(filterPanel).to.exist;
  });

  it('hides the submit button', function () {
    expect(filterPanel.$button.classList.contains('visuallyhidden')).to.be.true;
  });

});
