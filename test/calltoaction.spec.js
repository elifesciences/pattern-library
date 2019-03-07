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

    beforeEach(() => {
      expireCookie(expectedCookieName);
      expect(utils.getCookieValue(expectedCookieName, document.cookie)).to.be.empty;
    });

    context('when dismissed', () => {

      beforeEach(() => {
        callToAction.$elm.classList.add('call-to-action-wrapper--js-shown');
      });

      afterEach(() => {
        callToAction.$elm.classList.remove('call-to-action-wrapper--js-shown');
      });

      it('does not have the CSS class "call-to-action-wrapper--js-shown"', () => {
        callToAction.handleInteraction(getMockEvent('call-to-action__dismiss'));
        expect($elm.classList.contains('call-to-action-wrapper--js-shown')).to.be.false;
      });

      it(`sets a cookie "${expectedCookieName}=true"`, () => {
        callToAction.dismiss();
        expect(utils.getCookieValue(expectedCookieName, document.cookie)).to.equal('true');
      });

    });

    context('when actioned', () => {

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
        document.querySelector('.call-to-action-wrapper').classList.add('call-to-action-wrapper--js-shown');
      });

      it('does not have the CSS class "call-to-action-wrapper--js-shown"', () => {
        callToAction = new CallToAction($elm);
        expect($elm.classList.contains('call-to-action-wrapper--js-shown')).to.be.false;
      });

    });

    context(`when the cookie "${expectedCookieName}=true" is not currently set`, () => {

      let callToAction;

      beforeEach(() => {
        expireCookie(expectedCookieName);
        document.querySelector('.call-to-action-wrapper').classList.remove('call-to-action-wrapper--js-shown');
      });

      it('has the CSS class "call-to-action-wrapper--js-shown"', () => {
        callToAction = new CallToAction($elm);
        expect($elm.classList.contains('call-to-action-wrapper--js-shown')).to.be.true;
      });

    });

    describe('the cookie name', () => {

      it('is the string "callToAction_" appended with the id attribute of the component\'s HTML element', () => {
        expect(utils.getCookieValue(expectedCookieName, document.cookie)).to.be.empty;
        (new CallToAction($elm)).dismiss();
        expect(utils.getCookieValue(expectedCookieName, document.cookie)).to.equal('true');
      });

      context('when the component\'s HTML element is missing an id attribute', () => {

        let $elmNoId;
        let callToActionWithElmNoId;

        beforeEach(() => {
          $elmNoId = $elm.cloneNode(true);
          $elmNoId.setAttribute('id', '');
          $elm.parentElement.appendChild($elmNoId);

          callToActionWithElmNoId = new CallToAction($elmNoId);
        });

        afterEach(() => {
          $elmNoId.parentElement.removeChild($elmNoId);
        });

        it('does not create a dismiss button', () => {
          expect(callToActionWithElmNoId.$button).to.be.undefined;
        });

        context('when actioned', () => {

          it('does not set a cookie', () => {
            expect(utils.getCookieValue('callToAction_', document.cookie)).to.be.empty;
          });

        });

      });

    });

  });

});
