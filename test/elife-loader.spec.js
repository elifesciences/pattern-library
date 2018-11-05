const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;
const spy = sinon.spy;

// load in component(s) to be tested
let loader = require('../assets/js/elife-loader');

describe('The eLife Loader', function () {
  "use strict";

  let loader;

  describe("and the network information", function() {
    it("is available", function() {
      const networkInfoMock = {
        effectiveType: 'some string'
      };
      expect(isNetworkInformationAvailable(networkInfoMock)).to.be.true;
    });

    it("is not available", function() {
      const networkInfoMock = {
        effectiveType: []
      };
      expect(isNetworkInformationAvailable(networkInfoMock)).to.be.false;
      expect(isNetworkInformationAvailable(null)).to.be.false;
    });

  });

  describe('and network speed', function(){

    it('is above 2g', function() {
      expect(networkIsDefinitelySlow()).to.be.false;
    });
    
    it("is 2g or slower", function() {
      const networkSpeed = {
        effectiveType: '2g'
      }
      expect(networkSpeed.effectiveType.indexOf('2g') > -1).to.be.true;
    });

    it('is not available', function() {
      expect(!isNetworkInformationAvailable(navigator.connection)).to.be.false;
    });

  });

});
