let expect = chai.expect;

// load in component(s) to be tested
let PersonalisedCoverDownload = require('../assets/js/components/PersonalisedCoverDownload');

describe('A PersonalisedCoverDownload Component', () => {
  'use strict';

  let $elm = document.querySelector('[data-behaviour="PersonalisedCoverDownload"]');
  let personalisedCoverDownload;

  beforeEach(() => {
    personalisedCoverDownload = new PersonalisedCoverDownload($elm, window, window.document);
  });

  it('exists', () => {
    expect(personalisedCoverDownload).to.exist;
  });

  describe('the checkbox/button collections interaction', () => {
    let a4ButtonCollection;
    let letterButtonCollection;

    before(function () {
      a4ButtonCollection = document.querySelector('.button-collection--a4');
      letterButtonCollection = document.querySelector('.button-collection--usletter');
    });

    context('before clicking the checkbox', () => {
      it('the A4 download menu is not hidden', function () {
        expect(a4ButtonCollection.getAttribute('class')).not.to.contain('visuallyhidden');
      });

      it('the US letter download menu is hidden', function () {
        expect(letterButtonCollection.getAttribute('class')).to.contain('visuallyhidden');
      });
    });

    context('after clicking the checkbox', () => {
      it('the A4 download menu is hidden', function () {
        personalisedCoverDownload.toggleButtons(true);
        expect(a4ButtonCollection.getAttribute('class')).to.contain('visuallyhidden');
      });

      it('the US letter download menu is not hidden', function () {
        personalisedCoverDownload.toggleButtons(true);
        expect(letterButtonCollection.getAttribute('class')).not.to.contain('visuallyhidden');
      });
    });
  });

});
