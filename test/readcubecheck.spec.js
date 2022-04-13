const expect = chai.expect;

require('core-js/es6/promise');

// CheckPMC module
const CheckPMC = require('../assets/js/components/CheckPMC');
const fixtureHTML = document.querySelector('.article-download-list').innerHTML;

const resetFixture = fixtureHTML => {
  document.querySelector('.article-download-list').innerHTML = fixtureHTML;
}

describe('Check PMC integration', () => {
  'use strict';

  let $elmWorking;
  let checkPMCWorking;
  let $elmBroken;
  let checkPMCBroken;

  beforeEach(() => {
    resetFixture(fixtureHTML);
    $elmWorking = document.querySelector('#check-pmc-found[data-behaviour="CheckPMC"]');
    checkPMCWorking = new CheckPMC($elmWorking, window, window.document);
    $elmBroken = document.querySelector('#check-pmc-not-found[data-behaviour="CheckPMC"]');
    checkPMCBroken = new CheckPMC($elmBroken, window, window.document);
  });

  // Mocks
  CheckPMC.prototype.checkPMC = url => {
    return Promise.resolve((url !== 'broken'));
  };

  it('exists', () => {
    expect(checkPMCWorking).to.exist;
    expect(checkPMCBroken).to.exist;
  });

  it('cleans list items that fail PMC checks', done => {
    expect(document.querySelectorAll('.article-download-links-list__item')).to.have.length(3);
    setTimeout(() => {
      expect(document.querySelectorAll('.article-download-links-list__item')).to.have.length(2);
      expect(document.querySelector('.article-download-links-list__item:nth-child(1) a').textContent).to.equal('Mendeley');
      expect(document.querySelector('.article-download-links-list__item:nth-child(2) a').textContent).to.equal('ReadCube (working)');
      done();
    }, 0);
  });

});
