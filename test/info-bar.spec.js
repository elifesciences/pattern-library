const chai = require('chai');
const fixture = require('./fixtures/infoBarFixture');
const InfoBar = require('../assets/js/components/InfoBar');
const utils = require('../assets/js/libs/elife-utils')();

const expect = chai.expect;

function generateRandomId() {
  'use strict';

  return `id-${Math.floor(Math.random() * 10000)}`;
}

describe('A dismissible InfoBar Component', function () {
  'use strict';

  afterEach(function() {
    fixture.removeAllGeneratedHTMLFixtures();
  });

  it('is hidden immediately if a cookie indicates it was previously dismissed', function () {
    const id = generateRandomId();
    const value = 'true';
    fixture.setFixtureCookie(id, value);
    expect(utils.getCookieValue(`${fixture.getFixtureCookieNameRoot()}${id}`, document.cookie), 'cookie should be set').to.equal(value);

    const $infoBar = fixture.generateHTMLWithCookieDetails(fixture.getFixtureCookieNameRoot(), id);
    const infoBar = new InfoBar($infoBar);
    expect(infoBar.$elm.classList.contains('hidden')).to.be.true;

    fixture.clearFixtureCookie(id);
    expect(utils.getCookieValue(`${fixture.getFixtureCookieNameRoot()}${id}`, document.cookie), 'cookie shouldn\'t be set').to.equal('');
  });

  it('is not hidden immediately if no cookie indicates it was previously dismissed', function () {
    const $infoBar = fixture.generateHTML();
    const infoBar = new InfoBar($infoBar);
    expect(infoBar.$elm.classList.contains('hidden')).to.be.false;
  });

  it('has a dismiss button', function () {
    const $infoBar = fixture.generateHTML();
    const infoBar = new InfoBar($infoBar);
    const $button = infoBar.dismiss.$button;
    expect($button.classList.contains('dismiss-button')).to.be.true;
  });

  describe('dismiss button', function () {

    it('is a child of .info-bar__container', function () {
      const infoBar = new InfoBar(fixture.generateHTML());
      const $button = infoBar.dismiss.$button;
      expect($button.parentElement.classList.contains('info-bar__container')).to.be.true;
    });

    context('when clicked', function () {

      it('adds CSS class "hidden" to the info bar', function () {
        const $infoBar = fixture.generateHTML();
        const infoBar = new InfoBar($infoBar);
        const $button = infoBar.dismiss.$button;
        expect($infoBar.classList.contains('hidden')).to.be.false;
        $button.click();
        expect($infoBar.classList.contains('hidden')).to.be.true;
      });

      it('sets a cookie', function () {
        const id = generateRandomId();
        expect(utils.getCookieValue(`${fixture.getFixtureCookieNameRoot()}${id}`, document.cookie), 'cookie should not be set').to.equal('');

        const infoBar = new InfoBar(fixture.generateHTMLWithCookieDetails(fixture.getFixtureCookieNameRoot(), id));
        infoBar.dismiss.$button.click();

        expect(utils.getCookieValue(`fixture-cookie_${id}`, document.cookie)).to.equal('true');
      });

      context('the cookie it sets', function () {

        describe('name', function () {

          it('is derived from the HTML element\'s id and data-cookie-name-root attribute', function () {
            const id = generateRandomId();
            const infoBar = new InfoBar(fixture.generateHTMLWithCookieDetails(fixture.getFixtureCookieNameRoot(), id));
            infoBar.dismiss.$button.click();
            expect(infoBar.dismiss.cookieName).to.equal(`fixture-cookie_${id}`);
            expect(utils.getCookieValue(`fixture-cookie_${id}`, document.cookie)).to.equal('true');
          });

          it('is empty if the HTML element lacks an id', function () {
            const $infoBar = fixture.generateHTML();
            $infoBar.dataset.cookieNameRoot = 'fixture-cookie_';

            const infoBar = new InfoBar($infoBar);
            expect(infoBar.dismiss.cookieName).to.equal('');

            $infoBar.parentElement.removeChild($infoBar);
          });

          it('is empty if the HTML element lacks a data-cookie-name-root attribute', function () {
            const id = generateRandomId();
            const $infoBar = fixture.generateHTMLWithCookieDetails(fixture.getFixtureCookieNameRoot(), id);
            delete $infoBar.dataset.cookieNameRoot;

            const infoBar = new InfoBar($infoBar);
            expect(infoBar.dismiss.cookieName).to.equal('');

            $infoBar.parentElement.removeChild($infoBar);
          });

        });

        describe('expiry date', function () {

          it('is configured with the value of data-cookie-expires HTML attribute, if set', function () {
            const id = generateRandomId();
            const expiry = 'Tue, 19 January 2038 03:14:07 UTC';
            const infoBar = new InfoBar(fixture.generateHTMLWithCookieDetails(fixture.getFixtureCookieNameRoot(), id, expiry));
            expect(infoBar.dismiss.cookieExpiryDate).to.equal(expiry);

            fixture.clearFixtureCookie(id);
            expect(utils.getCookieValue(`${fixture.getFixtureCookieNameRoot()}${id}`, document.cookie), 'cookie shouldn\'t be set').to.equal('');

          });

          it('is configured with a day offset of the value of data-cookie-duration HTML attribute, if set', function () {
            const id = generateRandomId();

            // 7 days in the future
            let expiry = new Date(new Date());
            expiry.setDate(expiry.getDate() + 7);
            expiry = expiry.toUTCString();

            const $infoBar = fixture.generateHTMLWithCookieDetails(fixture.getFixtureCookieNameRoot(), id, expiry);

            const infoBar = new InfoBar($infoBar);
            const actualExpiry = (new Date(infoBar.dismiss.cookieExpiryDate)).toUTCString();
            expect(actualExpiry).to.equal(expiry);

            fixture.clearFixtureCookie(id);
            expect(utils.getCookieValue(`${fixture.getFixtureCookieNameRoot()}${id}`, document.cookie), 'cookie shouldn\'t be set').to.equal('');

          });

        });

      });

    });

  });

});
