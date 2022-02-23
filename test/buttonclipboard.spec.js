const chai = require('chai');

const expect = chai.expect;

// load in component(s) to be tested
const ButtonClipboard = require('../assets/js/components/ButtonClipboard');

describe('A button can be used to store text in clipboard', () => {
  'use strict';

  let $elm;

  beforeEach(() =>  {
    $elm = document.querySelector('[data-behaviour="ButtonClipboard"]');
    new ButtonClipboard($elm);
  });

  it.skip('stores text into clipboard', () => {
    // write test to check button clipboard here.
    expect(true).to.equal(false);
  });

});
