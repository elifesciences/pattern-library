const utils = require('../assets/js/libs/elife-utils')();
const chai = require('chai');

const expect = chai.expect;

// load in component(s) to be tested
const CallToAction = require('../assets/js/components/CallToAction');

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

describe('A CallToAction Component', function () {
  const $elm = document.querySelector('.call-to-action-wrapper');
  const expectedCookieName = `callToAction_${$elm.id}`;
  let callToAction;

  beforeEach(() => {
    callToAction = new CallToAction($elm);
  });

  afterEach(() => {
    if (callToAction.$button instanceof HTMLButtonElement) {
      callToAction.$button.parentNode.removeChild(callToAction.$button);
    }
  });

  it('builds a button to enable itself to be dismissed', () => {
    expect(callToAction.$button).to.be.an.instanceof(HTMLButtonElement);
  });

  context('handles cookies such that', () => {

    context('when dismissed', () => {

      beforeEach(() => {
        expireCookie(expectedCookieName);
        expect(utils.getCookieValue(expectedCookieName, document.cookie)).to.equal('');
      });

      it('is hidden', () => {
        callToAction.$elm.classList.remove('hidden');
        callToAction.handleInteraction(getMockEvent('call-to-action__close'));
        expect($elm.classList.contains('hidden')).to.be.true;
      });

      it(`sets a cookie "${expectedCookieName}=true"`, () => {
        callToAction.dismiss();
        expect(utils.getCookieValue(expectedCookieName, document.cookie)).to.equal('true');
      });

    });

    context('when actioned', () => {

      beforeEach(() => {
        expireCookie(expectedCookieName);
        expect(utils.getCookieValue(expectedCookieName, document.cookie)).to.equal('');
      });

      it(`sets a cookie "${expectedCookieName}=true"`, () => {
        callToAction.handleInteraction(getMockEvent('call-to-action__button'));
        expect(utils.getCookieValue(expectedCookieName, document.cookie)).to.equal('true');
      });

    });

    context(`when the cookie "${expectedCookieName}=true" has previously been set`, () => {

      let callToAction;

      beforeEach(() => {
        const expiryDate = 'Tue, 19 January 2038 03:14:07 UTC';
        document.cookie = `${expectedCookieName}=true; expires=${expiryDate}; path=/;`;
      });

      it('is hidden', () => {
        const $elm = document.querySelector('.call-to-action-wrapper');
        $elm.classList.remove('hidden');
        callToAction = new CallToAction($elm);
        expect(callToAction.$elm.classList.contains('hidden')).to.be.true;
      });

    });

    describe('the cookie name', () => {

      it('is the string "callToAction_" appended with the id of the component\'s HTML element', () => {
        expect(utils.getCookieValue(expectedCookieName, document.cookie)).to.equal('true');
      });

    });

  });

});
