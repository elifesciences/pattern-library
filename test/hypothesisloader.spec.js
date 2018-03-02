// jscs:disable maximumLineLength
const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;
const spy = sinon.spy;

const HypothesisLoader = require('../assets/js/components/HypothesisLoader');
const getValidConfig = require('./fixtures/hypothesisLoaderValidConfig');

describe('A HypothesisLoader Component', function () {
  'use strict';

  describe('Instantiation', () => {
    let $elm;
    let loader;

    beforeEach(() => {
      $elm = document.querySelector('[data-behaviour="HypothesisLoader"]');
      window.elifeConfig = {
        hypothesis: getValidConfig().loggedIn
      };

      loader = new HypothesisLoader($elm, window);
    });

    afterEach(() => {
      delete window.elifeConfig;
    });

    it('is a singleton', () => {
      expect(loader.isSingleton).to.be.true;
    });

    it('assigns the hypothesis config it builds to the "window.hypothesisConfig" property', () => {
      expect(window.hypothesisConfig).to.deep.equal(getValidConfig().loggedIn);
    });

  });

  describe('loading', () => {

    let $elm;
    let loader;

    beforeEach(() => {
      $elm = document.querySelector('[data-behaviour="HypothesisLoader"]');
      window.elifeConfig = {
        hypothesis: getValidConfig().loggedIn
      };

      loader = new HypothesisLoader($elm, window);
    });

    afterEach(() => {
      delete window.elifeConfig;
    });

    it('loads from the endpoint https://hypothes.is/embed.js', () => {
      expect(loader.$embedder.src).to.equal('https://hypothes.is/embed.js');
    });

    context('handling load failure', () => {

      beforeEach(() => {
        if (typeof $elm.dataset.hypothesisEmbedLoadStatus !== 'undefined') {
          delete $elm.dataset.hypothesisEmbedLoadStatus;
        }
      });

      it('sets the data attribute hypothesis-embed-load-status to "failed" on its own element', () => {
        loader.handleError();
        expect($elm.dataset.hypothesisEmbedLoadStatus).to.equal('failed');
      });

      it('emits a loaderror event with the message "Hypothesis embed load failed"', () => {
        spy($elm, 'dispatchEvent');

        loader.handleError();

        expect($elm.dispatchEvent.calledOnce).is.true;

        const callArgs = $elm.dispatchEvent.getCall(0).args;
        expect(callArgs).to.have.lengthOf(1);
        const callArg = callArgs[0];
        expect(callArg).to.be.an.instanceOf(ErrorEvent);
        expect(callArg.type).to.equal('loaderror');
        expect(callArg.message).to.equal('Hypothesis embed load failed');

        $elm.dispatchEvent.restore();
      });

    });

  });

  describe('validating config', () => {

    let config;

    beforeEach(() => {
      config = getValidConfig();
    });

    afterEach(() => {
      config = null;
    });

    it('doesn\'t throw an error when valid config is used', () => {
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).not.to.throw;
    });

    it('throws an error if the usernameUrl property is not an absolute url', () => {
      config.loggedIn.usernameUrl = null;
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "usernameUrl"/);

      config.loggedIn.usernameUrl = 'some non-url string';
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "usernameUrl"/);
    });

    it('throws an error if the apiUrl property is not an absolute url', () => {
      config.loggedIn.services[0].apiUrl = null;
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "apiUrl"/);

      config.loggedIn.services[0].apiUrl = 'some non-url string';
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "apiUrl"/);
    });

    it('throws an error if the icon property is not an absolute url', () => {
      config.loggedIn.services[0].icon = null;
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "icon"/);

      config.loggedIn.services[0].icon = 'some non-url string';
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "icon"/);

    });

    it('throws an error if the authority property is not a populated string', () => {
      config.loggedIn.services[0].authority = null;
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "authority"/);

      config.loggedIn.services[0].authority = '';
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "authority"/);

    });

    context('when there is a truthy onLogoutRequest property', () => {

      let loggedInConfig;

      beforeEach(() => {
        loggedInConfig = getValidConfig().loggedIn;
        expect(!!loggedInConfig.services[0].onLogoutRequest).to.be.true;
      });

      it('throws an error if there is not a truthy onProfileRequest property', () => {
        loggedInConfig.services[0].onProfileRequest = null;
        expect(() => {
          HypothesisLoader.validateConfig(loggedInConfig);
        }).to.throw(/Couldn't find a valid property with the name "onProfileRequest"/);
      });

      it('throws an error if the grantToken property is not a populated string', () => {
        loggedInConfig.services[0].grantToken = null;
        expect(() => {
          HypothesisLoader.validateConfig(loggedInConfig);
        }).to.throw(/Couldn't find a valid property with the name "grantToken"/);

        loggedInConfig.services[0].grantToken = '';
        expect(() => {
          HypothesisLoader.validateConfig(loggedInConfig);
        }).to.throw(/Couldn't find a valid property with the name "grantToken"/);
      });

      it('throws an error if there is a truthy onLoginRequest property', () => {
        loggedInConfig.services[0].onLoginRequest = true;
        expect(() => {
          HypothesisLoader.validateConfig(loggedInConfig);
        }).to.throw(/Couldn't find exactly one of the properties "onLoginRequest" and "onLogoutRequest"/);
      });

    });

    context('when there is not a truthy onLogoutRequest property', () => {

      let loggedOutConfig;

      beforeEach(() => {
        loggedOutConfig = getValidConfig().loggedOut;
        expect(!!loggedOutConfig.services[0].onLogoutRequest).to.be.false;
      });

      it('throws an error if there is not a truthy onLoginRequest property', () => {
        loggedOutConfig.services[0].onLoginRequest = null;
        expect(() => {
          HypothesisLoader.validateConfig(loggedOutConfig);
        }).to.throw(/Couldn't find exactly one of the properties "onLoginRequest" and "onLogoutRequest"/);
      });

      it('throws an error if there is a truthy onProfileRequest property', () => {
        loggedOutConfig.services[0].onProfileRequest = true;
        expect(() => {
          HypothesisLoader.validateConfig(loggedOutConfig);
        }).to.throw(/Found both mutually exclusive properties "onLoginRequest" and "onProfileRequest"/);
      });

      it('throws an error if the grantToken property is not null', () => {
        loggedOutConfig.services[0].grantToken = true;
        expect(() => {
          HypothesisLoader.validateConfig(loggedOutConfig);
        }).to.throw(/Expected the property "grantToken" to be null, but it wasn't/);

      });

    });

  });

});
