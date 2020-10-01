'use strict';
const expect = require('chai').expect;

describe('Personalised cover download page', function() {
  let personalisedCoverButtons;

  before(function () {
    browser.url('/patterns/01-molecules-components-personalised-cover-download/01-molecules-components-personalised-cover-download.html')
    personalisedCoverButtons = browser.element('.personalised-cover-buttons');
  });

  it('has the correct behaviour assigned', () => {
    expect(personalisedCoverButtons.getAttribute('data-behaviour')).to.equal('PersonalisedCoverDownload');
  });

});
