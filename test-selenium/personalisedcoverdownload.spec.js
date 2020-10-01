'use strict';
const expect = require('chai').expect;

describe('Personalised cover download page', () => {
  let personalisedCoverButtons;

  before(() => {
    browser.url('/patterns/01-molecules-components-personalised-cover-download/01-molecules-components-personalised-cover-download.html')
    personalisedCoverButtons = browser.element('.personalised-cover-buttons');
  });

  it('has the correct behaviour assigned', () => {
    expect(personalisedCoverButtons.getAttribute('data-behaviour')).to.equal('PersonalisedCoverDownload');
  });

  describe('the button collections/checkbox interaction', () => {
    let a4ButtonCollection;
    let letterButtonCollection;
    let checkbox;

    before(() => {
      a4ButtonCollection = personalisedCoverButtons.element('.button-collection--a4');
      letterButtonCollection = personalisedCoverButtons.element('.button-collection--usletter');
      checkbox = personalisedCoverButtons.element('.toggle-checkbox');
    });

    context('before clicking the checkbox', () => {
      it('the A4 download menu is not hidden by default', () => {
        expect(a4ButtonCollection.getAttribute('class')).not.to.contain('visuallyhidden');
      });
  
      it('the US letter download menu is hidden by default', () => {
        expect(letterButtonCollection.getAttribute('class')).to.contain('visuallyhidden');
      });
    });

    context('after clicking the checkbox', () => {
      beforeEach(() => {
        checkbox.click();
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
