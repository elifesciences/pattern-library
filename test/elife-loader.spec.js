const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;
const spy = sinon.spy;

// load in component(s) to be tested
let loader = require('../assets/js/elife-loader');

describe('The eLife Loader', function () {
  "use strict";

  let loader;

  describe("is network information available", function() {
    it("and the network information is available", function() {
      const networkInfoMock = {
        effectiveType: 'some string'
      };
      expect(isNetworkInformationAvailable(networkInfoMock)).to.be.true;
    });

    it("and the network information is not available", function() {
      const networkInfoMock = {
        effectiveType: []
      };
      expect(isNetworkInformationAvailable(networkInfoMock)).to.be.false;
      expect(isNetworkInformationAvailable(null)).to.be.false;
    });

  });


});
