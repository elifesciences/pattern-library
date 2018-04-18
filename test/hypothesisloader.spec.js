// jscs:disable maximumLineLength
const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;
const spy = sinon.spy;

const HypothesisLoader = require('../assets/js/components/HypothesisLoader');
const getValidConfig = require('./fixtures/hypothesisLoaderValidConfig');

/**
 * Given two objects, removes the properties that are functions. Returns the objects without their
 * function properties, and a Set of the property names of the removed functions.
 *
 * Used as a helper for determining deep equals comparisons of objects containing functions: deep
 * equals function comparison uses identity comparison, which is too strict.
 * see https://github.com/chaijs/chai/issues/697
 *
 * @param o1 first compared object
 * @param o2 second compared object
 * @return {{first: *, second: *, fns: Set<string>}}
 */
function separateFnsFromOtherProps(o1, o2) {
  'use strict';

  // Move the functions into a set to be dealt with separately
  const fns = new Set();
  const _o1 = Object.assign({}, o1);
  const _o2 = Object.assign({}, o2);

  for (let prop in _o1) {
    if (_o1.hasOwnProperty(prop)) {
      if (typeof _o1[prop] === 'function') {
        fns.add(prop);
        delete _o1[prop];
      }
    }
  }

  for (let prop in _o2) {
    if (_o2.hasOwnProperty(prop)) {
      if (typeof _o2[prop] === 'function') {
        fns.add(prop);
        delete _o2[prop];
      }
    }
  }

  return {
    first: _o1,
    second: _o2,
    fns
  };

}

describe('A HypothesisLoader Component', function () {
  'use strict';

  describe('on instantiation', () => {
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

    it('builds the hypothesis config as a function', () => {
      expect(window.hypothesisConfig).to.be.a('function');
    });

    it('assigns the hypothesis config built to the window.hypothesisConfig property', () => {
      const servicesWithProcessedFns = separateFnsFromOtherProps(window.hypothesisConfig().services[0], getValidConfig().loggedIn.services[0]);
      expect(servicesWithProcessedFns.first).to.deep.equal(servicesWithProcessedFns.second);
      servicesWithProcessedFns.fns.forEach((propertyName) => {
        expect(window.hypothesisConfig().services[0]).to.have.property(propertyName);
        expect(getValidConfig().loggedIn.services[0]).to.have.property(propertyName);
      });

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

      it('sets the data attribute hypothesis-embed-load-status to "failed" on the created script element', () => {
        loader.handleLoadError(loader.$embedder);
        expect(loader.$embedder.dataset.hypothesisEmbedLoadStatus).to.equal('failed');
      });

      it('emits a loaderror event with the message "Hypothesis embed load failed"', () => {
        const $spiedOn = loader.$embedder;
        spy($spiedOn, 'dispatchEvent');

        loader.handleLoadError($spiedOn);

        expect($spiedOn.dispatchEvent.calledOnce).is.true;

        const callArgs = $spiedOn.dispatchEvent.getCall(0).args;
        expect(callArgs).to.have.lengthOf(1);
        const callArg = callArgs[0];
        expect(callArg).to.be.an.instanceOf(ErrorEvent);
        expect(callArg.type).to.equal('loaderror');
        expect(callArg.message).to.equal('Hypothesis embed load failed');

        $spiedOn.dispatchEvent.restore();
      });

    });

  });

  describe('validating properties returned by the config function', () => {

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

    it('throws the expected error if the usernameUrl property is not an absolute url', () => {
      config.loggedIn.usernameUrl = null;
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "usernameUrl"/);

      config.loggedIn.usernameUrl = 'some non-url string';
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "usernameUrl"/);
    });

    it('throws the expected error if the apiUrl property is not an absolute url', () => {
      config.loggedIn.services[0].apiUrl = null;
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "apiUrl"/);

      config.loggedIn.services[0].apiUrl = 'some non-url string';
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "apiUrl"/);
    });

    it('throws the expected error if the icon property is not an absolute url', () => {
      config.loggedIn.services[0].icon = null;
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "icon"/);

      config.loggedIn.services[0].icon = 'some non-url string';
      expect(() => {
        HypothesisLoader.validateConfig(config.loggedIn);
      }).to.throw(/Couldn't find a valid property with the name "icon"/);

    });

    it('throws the expected error if the authority property is not a populated string', () => {
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

      it('throws the expected error if there is not a truthy onProfileRequest property', () => {
        loggedInConfig.services[0].onProfileRequest = null;
        expect(() => {
          HypothesisLoader.validateConfig(loggedInConfig);
        }).to.throw(/Couldn't find a valid property with the name "onProfileRequest"/);
      });

      it('throws the expected error if the grantToken property is not a populated string', () => {
        loggedInConfig.services[0].grantToken = null;
        expect(() => {
          HypothesisLoader.validateConfig(loggedInConfig);
        }).to.throw(/Couldn't find a valid property with the name "grantToken"/);

        loggedInConfig.services[0].grantToken = '';
        expect(() => {
          HypothesisLoader.validateConfig(loggedInConfig);
        }).to.throw(/Couldn't find a valid property with the name "grantToken"/);
      });

      it('throws the expected error if there is a truthy onLoginRequest property', () => {
        loggedInConfig.services[0].onLoginRequest = true;
        expect(() => {
          HypothesisLoader.validateConfig(loggedInConfig);
        }).to.throw(/Couldn't find exactly one of the properties "onLoginRequest" and "onLogoutRequest"/);
      });

      it('throws the expected error if there is a truthy onSignupRequest property', () => {
        loggedInConfig.services[0].onSignupRequest = true;
        expect(() => {
          HypothesisLoader.validateConfig(loggedInConfig);
        }).to.throw(/Found both mutually exclusive properties "onLogoutRequest" and "onSignupRequest"/);
      });

    });

    context('when there is not a truthy onLogoutRequest property', () => {

      let loggedOutConfig;

      beforeEach(() => {
        loggedOutConfig = getValidConfig().loggedOut;
        expect(!!loggedOutConfig.services[0].onLogoutRequest).to.be.false;
      });

      it('throws the expected error if there is not a truthy onLoginRequest property', () => {
        loggedOutConfig.services[0].onLoginRequest = null;
        expect(() => {
          HypothesisLoader.validateConfig(loggedOutConfig);
        }).to.throw(/Couldn't find exactly one of the properties "onLoginRequest" and "onLogoutRequest"/);
      });

      it('throws the expected error if there is not a truthy onSignupRequest property', () => {
        loggedOutConfig.services[0].onSignupRequest = null;
        expect(() => {
          HypothesisLoader.validateConfig(loggedOutConfig);
        }).to.throw(/Couldn't find a valid property with the name "onSignupRequest"/);
      });

      it('throws the expected error if there is a truthy onProfileRequest property', () => {
        loggedOutConfig.services[0].onProfileRequest = true;
        expect(() => {
          HypothesisLoader.validateConfig(loggedOutConfig);
        }).to.throw(/Found both mutually exclusive properties "onLoginRequest" and "onProfileRequest"/);
      });

      it('throws the expected error if the grantToken property is not null', () => {
        loggedOutConfig.services[0].grantToken = true;
        expect(() => {
          HypothesisLoader.validateConfig(loggedOutConfig);
        }).to.throw(/Expected the property "grantToken" to be null, but it was not null/);

      });

    });

  });

});
