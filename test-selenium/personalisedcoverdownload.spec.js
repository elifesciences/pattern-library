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
    let checkbox;

    before(function () {
      checkbox = personalisedCoverButtons.element('input');
    });

    it('the checkbox is unchecked by default', () => {
      expect(checkbox.checked).to.be(false);
    });

    it('the A4 download menu is not hidden by default', () => {
      expect(a4ButtonCollection.getAttribute('class')).not.to.contain('visuallyhidden');
    });

    it('the US letter download menu is hidden by default', () => {
      expect(letterButtonCollection.getAttribute('class')).to.contain('visuallyhidden');
    });
  });

});
