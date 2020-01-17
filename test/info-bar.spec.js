const chai = require('chai');
const fixtures = require('./fixtures/infoBarFixture');
const InfoBar = require('../assets/js/components/InfoBar');
const utils = require('../assets/js/libs/elife-utils')();

const expect = chai.expect;

describe('A dismissible InfoBar Component', function () {
  'use strict';

  afterEach(function() {
    fixtures.removeAllGeneratedHTMLFixtures();
  });

  it('is hidden immediately if a cookie indicates it was previously dismissed', function () {
    const id = fixtures.generateRandomId();
    const value = 'true';
    fixtures.setFixtureCookie(id, value);
    expect(utils.getCookieValue(`${fixtures.getCookieNameRoot()}${id}`, document.cookie), 'cookie should be set').to.equal(value);

    const $htmlFixture = fixtures.generateHTMLWithCookieDetails(fixtures.getCookieNameRoot(), id);
    const infoBar = new InfoBar($htmlFixture);
    expect(infoBar.$elm.classList.contains('hidden')).to.be.true;

    fixtures.clearCookie(id);
    expect(utils.getCookieValue(`${fixtures.getCookieNameRoot()}${id}`, document.cookie), 'cookie shouldn\'t be set').to.equal('');
  });

  it('is not hidden immediately if no cookie indicates it was previously dismissed', function () {
    const $fixture = fixtures.generateHTML();
    const infoBar = new InfoBar($fixture);
    expect(infoBar.$elm.classList.contains('hidden')).to.be.false;
  });

  it('has a dismiss button', function () {
    const $fixture = fixtures.generateHTML();
    const infoBar = new InfoBar($fixture);
    const $button = infoBar.dismissible.$button;
    expect($button.classList.contains('dismiss-button')).to.be.true;
  });

  describe('dismiss button', function () {

    it('is a child of .info-bar__container', function () {
      const infoBar = new InfoBar(fixtures.generateHTML());
      const $button = infoBar.dismissible.$button;
      expect($button.parentElement.classList.contains('info-bar__container')).to.be.true;
    });

    context('when clicked', function () {

      it('adds CSS class "hidden" to the info bar', function () {
        const $fixture = fixtures.generateHTML();
        const infoBar = new InfoBar($fixture);
        const $button = infoBar.dismissible.$button;
        expect($fixture.classList.contains('hidden')).to.be.false;
        $button.click();
        expect($fixture.classList.contains('hidden')).to.be.true;
      });

      describe('sets a cookie with', function () {

        describe('name', function () {

          it('is derived from the HTML element\'s id and data-cookie-name-root attribute', function () {
            const id = fixtures.generateRandomId();
            const $fixture = fixtures.generateHTMLWithCookieDetails(fixtures.getCookieNameRoot(), id);
            const infoBar = new InfoBar($fixture);
            infoBar.dismissible.$button.click();
            expect(infoBar.dismissible.cookieName).to.equal(`${fixtures.getCookieNameRoot()}${id}`);
            expect(utils.getCookieValue(`fixture-cookie_${id}`, document.cookie)).to.equal('true');
          });

          it('is empty if the HTML element lacks an id', function () {
            const $fixture = fixtures.generateHTML();
            $fixture.dataset.cookieNameRoot = fixtures.getCookieNameRoot();

            const infoBar = new InfoBar($fixture);
            expect(infoBar.dismissible.cookieName).to.equal('');

            $fixture.parentElement.removeChild($fixture);
          });

          it('is empty if the HTML element lacks a data-cookie-name-root attribute', function () {
            const id = fixtures.generateRandomId();
            const $fixture = fixtures.generateHTMLWithCookieDetails(fixtures.getCookieNameRoot(), id);
            delete $fixture.dataset.cookieNameRoot;

            const infoBar = new InfoBar($fixture);
            expect(infoBar.dismissible.cookieName).to.equal('');

            $fixture.parentElement.removeChild($fixture);
          });

        });

        describe('expiry date', function () {

          it('is configured with the value of data-cookie-expires HTML attribute, if set', function () {
            const id = fixtures.generateRandomId();
            const expiry = 'Tue, 19 Jan 2038 03:14:07 UTC';
            const $fixture = fixtures.generateHTMLWithCookieDetails(fixtures.getCookieNameRoot(), id, expiry);
            const infoBar = new InfoBar($fixture);
            expect(infoBar.dismissible.cookieExpiryDate).to.equal(expiry);

            fixtures.clearCookie(id);
            expect(utils.getCookieValue(`${fixtures.getCookieNameRoot()}${id}`, document.cookie), 'cookie shouldn\'t be set').to.equal('');

          });

        });

      });

    });

  });

});
