let expect = chai.expect;

// load in component(s) to be tested
let PersonalisedCoverDownload = require('../assets/js/components/PersonalisedCoverDownload');

describe('A PersonalisedCoverDownload Component', function () {
  'use strict';

  let $elm = document.querySelector('[data-behaviour="PersonalisedCoverDownload"]');
  let personalisedCoverDownload;

  beforeEach(function () {
    personalisedCoverDownload = new PersonalisedCoverDownload($elm, window, window.document);
  });

  it('exists', function () {
    expect(personalisedCoverDownload).to.exist;
  });

});
