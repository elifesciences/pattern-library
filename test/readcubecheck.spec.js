const expect = chai.expect;

require('core-js/es6/promise');

// CheckPMC module
const CheckPMC = require('../assets/js/components/CheckPMC');

describe('Check PMC integration', function () {
  'use strict';
  const root = {
    checkPMC: null,
    $elm: null
  };

  // Mocks
  CheckPMC.prototype.checkPMC = url => {
    return Promise.resolve((url !== 'broken'));
  };

  root.$elm = document.querySelector('[data-behaviour="CheckPMC"]');
  root.checkPMC = new CheckPMC(root.$elm, window, window.document);

  it('exists', function () {
    expect(root.checkPMC).to.exist;
  });

});
