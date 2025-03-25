const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;
const spy = sinon.spy;

describe('The eLife Loader', function () {
  "use strict";

  describe("checks the isNetworkInformationAvailable() function", function() {

    it("returns true when the network information is available", function() {
      const networkInfoMock = {
        effectiveType: 'some string'
      };

      expect(isNetworkInformationAvailable(networkInfoMock)).to.be.true;
    });

    it("returns true when the network information is not available", function() {

      const networkInfoMock = {
        effectiveType: []
      };

      expect(isNetworkInformationAvailable(networkInfoMock)).to.be.false;
      expect(isNetworkInformationAvailable(null)).to.be.false;
    });

  });

  describe('networkIsDefinitelySlow', function(){

    context('when network information is not available', function() {

      it('returns false', function() {
        const isNetworkInfoAvailableMock = function() {
          return false;
        };
        expect(networkIsDefinitelySlow(isNetworkInfoAvailableMock)).to.be.false;
      });

    });

    context('when network information is available', function(){

      context('the network speed is 2g', function() {

        it('returns true', function() {

          const isNetworkInfoAvailableMock = function() {
            return true
          };

          const navigatorConnectionMock = {
            effectiveType: '2g'
          }

          expect(networkIsDefinitelySlow(isNetworkInfoAvailableMock, navigatorConnectionMock)).to.be.true;
        });
      });

      context('the network speed is greater than 2g', function() {

        it('returns false', function() {

          const isNetworkInfoAvailableMock = function() {
            return true
          };

          const connectionSpeeds = ['3g', '4g'];
          connectionSpeeds.forEach((speed) => {
            const navigatorConnectionMock = {
            effectiveType: speed
          };

          expect(networkIsDefinitelySlow(isNetworkInfoAvailableMock, navigatorConnectionMock)).to.be.false;
          });

        });
      });

    });

  });

});
