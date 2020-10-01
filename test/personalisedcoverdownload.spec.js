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

  describe('toggleButtons()', () => {
    let a4ButtonCollection;
    let letterButtonCollection;

    before(() => {
      a4ButtonCollection = $elm.querySelector('.button-collection--a4');
      letterButtonCollection = $elm.querySelector('.button-collection--usletter');
    });

    context('default buttons', () => {
      it('the A4 download menu is not hidden', () => {
        expect(a4ButtonCollection.getAttribute('class')).not.to.contain('visuallyhidden');
      });

      it('the US letter download menu is hidden', () => {
        expect(letterButtonCollection.getAttribute('class')).to.contain('visuallyhidden');
      });
    });

    context('buttons when toggleButtons(false)', () => {
      beforeEach(() => {
        personalisedCoverDownload.toggleButtons(false);
      });

      it('the A4 download menu is not hidden', () => {
        expect(a4ButtonCollection.getAttribute('class')).not.to.contain('visuallyhidden');
      });

      it('the US letter download menu is hidden', () => {
        expect(letterButtonCollection.getAttribute('class')).to.contain('visuallyhidden');
      });
    });

    context('buttons when toggleButtons(true)', () => {
      beforeEach(() => {
        personalisedCoverDownload.toggleButtons(true);
      });

      it('the A4 download menu is hidden', () => {
        expect(a4ButtonCollection.getAttribute('class')).to.contain('visuallyhidden');
      });

      it('the US letter download menu is not hidden', () => {
        expect(letterButtonCollection.getAttribute('class')).not.to.contain('visuallyhidden');
      });
    });
  });

});
