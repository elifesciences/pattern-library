const chai = require('chai');
const CallToAction = require('../assets/js/components/CallToAction');
const fixtures = require('./fixtures/callToActionFixture');
const utils = require('../assets/js/libs/elife-utils')();

const expect = chai.expect;

describe('A Call to action Component', function () {
  'use strict';

  afterEach(function() {
    fixtures.removeAllGeneratedHTMLFixtures();
  });

  it('is hidden immediately if a cookie indicates it was previously dismissed', function () {
    const id = fixtures.generateRandomId();
    const cookieName = `${fixtures.getCookieNameRoot()}${id}`;
    const value = 'true';
    fixtures.setFixtureCookie(id, value);
    expect(utils.getCookieValue(cookieName, document.cookie), 'cookie should be set').to.equal(value);

    const $htmlFixture = fixtures.generateHTMLWithCookieDetails(fixtures.getCookieNameRoot(), id);
    const callToAction = new CallToAction($htmlFixture);
    expect(callToAction.$elm.classList.contains('hidden')).to.be.true;

    fixtures.clearCookie(id);
    expect(utils.getCookieValue(cookieName, document.cookie), 'cookie shouldn\'t be set').to.equal('');
  });

  it('is not hidden immediately if no cookie indicates it was previously dismissed', function () {
    const $fixture = fixtures.generateHTML();
    const callToAction = new CallToAction($fixture);
    expect(callToAction.$elm.classList.contains('hidden')).to.be.false;
  });

  it('has a dismiss button', function () {
    const $fixture = fixtures.generateHTML();
    const callToAction = new CallToAction($fixture);
    const $button = callToAction.dismissible.$button;
    expect($button.classList.contains('dismiss-button')).to.be.true;
  });

  describe('dismiss button', function () {

    it('is a child of .call-to-action', function () {
      const callToAction = new CallToAction(fixtures.generateHTML());
      const $button = callToAction.dismissible.$button;
      expect($button.parentElement.classList.contains('call-to-action')).to.be.true;
    });

    context('when clicked', function () {

      it('adds CSS class "hidden" to the call to action component', function () {
        const $fixture = fixtures.generateHTML();
        const callToAction = new CallToAction($fixture);
        const $button = callToAction.dismissible.$button;
        expect($fixture.classList.contains('hidden')).to.be.false;
        $button.click();
        expect($fixture.classList.contains('hidden')).to.be.true;
      });

      describe('sets a cookie with', function () {

        describe('name', function () {

          it('is derived from the HTML element\'s id and data-cookie-name-root attribute', function () {
            const id = fixtures.generateRandomId();
            const $fixture = fixtures.generateHTMLWithCookieDetails(fixtures.getCookieNameRoot(), id);
            const callToAction = new CallToAction($fixture);
            callToAction.dismissible.$button.click();
            const expectedCookieName = `${fixtures.getCookieNameRoot()}${id}`;
            expect(callToAction.dismissible.cookieName).to.equal(expectedCookieName);
            expect(utils.getCookieValue(expectedCookieName, document.cookie)).to.equal('true');
            fixtures.clearCookie(id);
          });

          it('is empty if the HTML element lacks an id', function () {
            const $fixture = fixtures.generateHTML();
            $fixture.dataset.cookieNameRoot = fixtures.getCookieNameRoot();

            const callToAction = new CallToAction($fixture);
            expect(callToAction.dismissible.cookieName).to.equal('');

            $fixture.parentElement.removeChild($fixture);
          });

          it('is empty if the HTML element lacks a data-cookie-name-root attribute', function () {
            const id = fixtures.generateRandomId();
            const $fixture = fixtures.generateHTMLWithCookieDetails(fixtures.getCookieNameRoot(), id);
            delete $fixture.dataset.cookieNameRoot;

            const callToAction = new CallToAction($fixture);
            expect(callToAction.dismissible.cookieName).to.equal('');

            $fixture.parentElement.removeChild($fixture);
          });

        });

        describe('expiry date', function () {

          it('is configured with the value of data-cookie-expires HTML attribute, if set', function () {
            const id = fixtures.generateRandomId();
            const expiry = 'Tue, 19 January 2038 03:14:07 UTC';
            const $fixture = fixtures.generateHTMLWithCookieDetails(fixtures.getCookieNameRoot(), id, expiry);
            const callToAction = new CallToAction($fixture);
            expect(callToAction.dismissible.cookieExpiryDate).to.equal(expiry);

            fixtures.clearCookie(id);
            expect(utils.getCookieValue(`${fixtures.getCookieNameRoot()}${id}`, document.cookie), 'cookie shouldn\'t be set').to.equal('');

          });

          it('is configured with a day offset of the value of data-cookie-duration HTML attribute, if set', function () {
            const id = fixtures.generateRandomId();

            // 7 days in the future
            let expiry = new Date(new Date());
            expiry.setDate(expiry.getDate() + 7);
            expiry = expiry.toUTCString();

            const $fixture = fixtures.generateHTMLWithCookieDetails(fixtures.getCookieNameRoot(), id, expiry);

            const callToAction = new CallToAction($fixture);
            const actualExpiry = (new Date(callToAction.dismissible.cookieExpiryDate)).toUTCString();
            expect(actualExpiry).to.equal(expiry);

            fixtures.clearCookie(id);
            expect(utils.getCookieValue(`${fixtures.getCookieNameRoot()}${id}`, document.cookie), 'cookie shouldn\'t be set').to.equal('');

          });

        });

      });

    });

  });

});
