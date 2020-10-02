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

  describe('behaviour of toggleButtons()', () => {
    let a4ButtonCollection;
    let letterButtonCollection;

    before(() => {
      a4ButtonCollection = $elm.querySelector('.button-collection--a4');
      letterButtonCollection = $elm.querySelector('.button-collection--usletter');
    });

    context('default behaviour', () => {
      it('displays the A4 download menu', () => {
        expect(a4ButtonCollection.getAttribute('class')).not.to.contain('visuallyhidden');
      });

      it('does not display the US letter download menu', () => {
        expect(letterButtonCollection.getAttribute('class')).to.contain('visuallyhidden');
      });
    });

    context('behaviour when toggleButtons(false)', () => {
      beforeEach(() => {
        personalisedCoverDownload.toggleButtons(false);
      });

      it('displays the A4 download menu', () => {
        expect(a4ButtonCollection.getAttribute('class')).not.to.contain('visuallyhidden');
      });

      it('does not display the US letter download menu', () => {
        expect(letterButtonCollection.getAttribute('class')).to.contain('visuallyhidden');
      });
    });

    context('buttons when toggleButtons(true)', () => {
      beforeEach(() => {
        personalisedCoverDownload.toggleButtons(true);
      });

      it('does not display the A4 download menu', () => {
        expect(a4ButtonCollection.getAttribute('class')).to.contain('visuallyhidden');
      });

      it('displays the US letter download menu', () => {
        expect(letterButtonCollection.getAttribute('class')).not.to.contain('visuallyhidden');
      });
    });
  });

});
