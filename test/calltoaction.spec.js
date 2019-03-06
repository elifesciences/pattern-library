const utils = require('../assets/js/libs/elife-utils')();
const chai = require('chai');

const expect = chai.expect;

// load in component(s) to be tested
const CallToAction = require('../assets/js/components/CallToAction');
const cookieName = 'testCookie';


function expireCookie(name) {
  const expiryDate = 'Tue, 1 January 1970 18:00:00 UTC';
  document.cookie = `${name}=true; expires=${expiryDate}; path=/;`;
}

function getMockEvent(actionableClassName) {
  return {
    target: {
      classList: {
        contains: (candidate) => {
          return candidate === actionableClassName;
        }
      }
    }
  };
}

describe('An CallToAction Component', function () {
  const $elm = document.querySelector('.call-to-action-wrapper');
  let callToAction;

  beforeEach(() => {
    callToAction = new CallToAction(cookieName, $elm);
  });

  afterEach(() => {
    if (callToAction.$button instanceof HTMLButtonElement) {
      callToAction.$button.parentNode.removeChild(callToAction.$button);
    }
  });

  it('builds a button to enable itself to be dismissed', () => {
    expect(callToAction.$button).to.be.an.instanceof(HTMLButtonElement);
  });

  context('when dismissed', () => {

    beforeEach(() => {
      expireCookie(cookieName);
      expect(utils.getCookieValue(cookieName, document.cookie)).to.equal('');
    });

    it('it is hidden', () => {
      callToAction.$elm.classList.remove('hidden');
      callToAction.handleInteraction(getMockEvent('call-to-action__close'));
      expect($elm.classList.contains('hidden')).to.be.true;
    });

    it(`it sets a cookie "${cookieName}=true"`, () => {
      callToAction.dismiss();
      expect(utils.getCookieValue(cookieName, document.cookie)).to.equal('true');
    });

  });

  context('when actioned', () => {

    beforeEach(() => {
      expireCookie(cookieName);
      expect(utils.getCookieValue(cookieName, document.cookie)).to.equal('');
    });

    it(`it sets a cookie "${cookieName}=true"`, () => {
      callToAction.handleInteraction(getMockEvent('call-to-action__button'));
      expect(utils.getCookieValue(cookieName, document.cookie)).to.equal('true');
    });

  });

  context(`when the cookie "${cookieName}=true" has previously been set`, () => {

    let callToAction;

    beforeEach(() => {
      const expiryDate = 'Tue, 19 January 2038 03:14:07 UTC';
      document.cookie = `${cookieName}=true; expires=${expiryDate}; path=/;`;
    });

    it('it is hidden', () => {
      const $elm = document.querySelector('.call-to-action-wrapper');
      $elm.classList.remove('hidden');
      callToAction = new CallToAction(cookieName, $elm);
      expect(callToAction.$elm.classList.contains('hidden')).to.be.true;
    });

  });

});
