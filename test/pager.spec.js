let expect = chai.expect;

// load in component(s) to be tested
let Pager = require('../assets/js/components/Pager');
let dummyData = require('./fixtures/pagerData')();

describe('A Pager', function () {
  'use strict';
  let $elm;
  let $loaderElement;
  let pager;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="Pager"]');
    pager = new Pager($elm);
    $loaderElement = pager.$loader;
  });

  it('exists', function () {
    expect(pager).to.exist;
  });

  it('has a loader element', () => {
    expect($loaderElement).to.be.instanceOf(HTMLElement);
  });

  describe('its loader element', () => {

    it('is the only child element of the pager', () => {
      expect($loaderElement.nextElementSibling).to.be.null;
      expect($loaderElement.previousElementSibling).to.be.null;
    });

  });

  

});
