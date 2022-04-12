const expect = chai.expect;

require('core-js/es6/promise');

// CheckPMC module
const CheckPMC = require('../assets/js/components/CheckPMC');

describe('Check PMC integration', () => {
  'use strict';

  let $downloadList;
  let $elmWorking;
  let checkPMCWorking;
  let $elmBroken;
  let checkPMCBroken;

  before(() => {
    $downloadList = document.querySelector('.article-download-list');
    $elmWorking = $downloadList.querySelector('#check-pmc-found[data-behaviour="CheckPMC"]');
    checkPMCWorking = new CheckPMC($elmWorking, window, window.document);
    $elmBroken = $downloadList.querySelector('#check-pmc-not-found[data-behaviour="CheckPMC"]');
    checkPMCBroken = new CheckPMC($elmBroken, window, window.document);
  });

  // Mocks
  CheckPMC.prototype.checkPMC = url => {
    return Promise.resolve('{"records": [{"pmcid": "PMCID"}]}');
  };

  it('exists', () => {
    expect(checkPMCWorking).to.exist;
    expect(checkPMCBroken).to.exist;
  });

});
