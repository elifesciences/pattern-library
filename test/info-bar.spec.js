const chai = require('chai');
const InfoBar = require('../assets/js/components/InfoBar');
const utils = require('../assets/js/libs/elife-utils')();

const expect = chai.expect;

function generateHTMLFixture() {
  'use strict';
  const $fixture = utils.buildElement(
    'div',
    ['info-bar',
     'info-bar--dismissible'],
    '',
    '.fixture-container'
  );

  $fixture.dataset.generatedFixture = '';
  return $fixture;
}

function setFixtureCookie(id, value) {
  'use strict';

  const val = value || 'true';
  document.cookie = `fixture-cookie_${id}=${val}; expires=expires=Tue, 19 January 2038 03:14:07 UTC; path=/;`;
  expect(utils.getCookieValue(`fixture-cookie_${id}`, document.cookie), 'cookie should be set').to.equal(val);
}

function clearFixtureCookie(id, value) {
  'use strict';

  const val = value || 'true';
  document.cookie = `fixture-cookie_${id}=${val}; expires=expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/;`;
  expect(utils.getCookieValue(`fixture-cookie_${id}`, document.cookie), 'cookie shouldn\'t be set').to.equal('');
}

describe('A dismissible InfoBar Component', function () {
  'use strict';

  describe('has a cookie', function () {

    describe('name', function () {

      it('that is derived from the HTML element\'s id and data-cookie-name-root attribute', function () {
        const $infoBar = generateHTMLFixture();
        $infoBar.dataset.cookieNameRoot = 'some-cookie-name-root_';
        $infoBar.setAttribute('id', 'some-id');

        const infoBar = new InfoBar($infoBar);
        expect(infoBar.dismiss.cookieName).to.equal('some-cookie-name-root_some-id');

        $infoBar.parentElement.removeChild($infoBar);
      });

      it('that is empty if the HTML element lacks an id', function () {
        const $infoBar = generateHTMLFixture();
        $infoBar.dataset.cookieNameRoot = 'some-cookie-name-root_';

        const infoBar = new InfoBar($infoBar);
        expect(infoBar.dismiss.cookieName).to.equal('');

        $infoBar.parentElement.removeChild($infoBar);
      });

      it('that is empty if the HTML element lacks a data-cookie-name-root attribute', function () {
        const $infoBar = generateHTMLFixture();
        $infoBar.setAttribute('id', 'some-id');

        const infoBar = new InfoBar($infoBar);
        expect(infoBar.dismiss.cookieName).to.equal('');

        $infoBar.parentElement.removeChild($infoBar);
      });

      it('that when empty does not cause the info bar to be hidden', function() {
        const $infoBar = generateHTMLFixture();
        const infoBar = new InfoBar($infoBar);
        expect(infoBar.$elm.classList.contains('hidden')).to.be.false;

        $infoBar.parentElement.removeChild($infoBar);
      });

    });

    describe('expiry date', function () {

      it('that is configured with the value of data-cookie-expires HTML attribute, if set', function () {
        const cookieId = Math.floor(Math.random() * 10000);
        const expectedExpiry = 'Tue, 19 January 2038 03:14:07 UTC';

        const $infoBar = generateHTMLFixture();
        $infoBar.setAttribute('id', cookieId.toString());
        $infoBar.dataset.cookieNameRoot = 'fixture-cookie_';
        $infoBar.dataset.cookieExpires = expectedExpiry;
        const infoBar = new InfoBar($infoBar);
        expect(infoBar.dismiss.cookieExpiryDate).to.equal(expectedExpiry);

        $infoBar.parentElement.removeChild($infoBar);
        clearFixtureCookie(cookieId);
      });

      it('that is configured with a day offset of the value of data-cookie-duration HTML attribute, if set', function () {
        const cookieId = Math.floor(Math.random() * 10000);

        // 7 days in the future
        let expectedExpiry = new Date(new Date());
        expectedExpiry.setDate(expectedExpiry.getDate() + 7);
        expectedExpiry = expectedExpiry.toUTCString();

        const $infoBar = generateHTMLFixture();
        $infoBar.setAttribute('id', cookieId.toString());
        $infoBar.dataset.cookieNameRoot = 'fixture-cookie_';
        $infoBar.dataset.cookieExpires = expectedExpiry;

        const infoBar = new InfoBar($infoBar);
        const actualExpiry = (new Date(infoBar.dismiss.cookieExpiryDate)).toUTCString();
        expect(actualExpiry).to.equal(expectedExpiry);

        $infoBar.parentElement.removeChild($infoBar);
      });

    });

    describe('that if already exists with the value "true"', function () {

      it('causes the info bar to be hidden', function () {
        const cookieId = Math.floor(Math.random() * 10000);
        setFixtureCookie(cookieId);

        const $infoBar = generateHTMLFixture();
        $infoBar.setAttribute('id', cookieId.toString());
        $infoBar.dataset.cookieNameRoot = 'fixture-cookie_';
        const infoBar = new InfoBar($infoBar);

        expect(infoBar.$elm.classList.contains('hidden')).to.be.true;

        $infoBar.parentElement.removeChild($infoBar);
        clearFixtureCookie(cookieId);
      });

    });

    describe('that if already exists with a value that is not "true"', function () {

      it('doesn\'t cause the info bar to be hidden', function () {
        const cookieId = Math.floor(Math.random() * 10000);
        setFixtureCookie(cookieId, 'false');

        const $infoBar = generateHTMLFixture();
        $infoBar.setAttribute('id', cookieId);
        $infoBar.dataset.cookieNameRoot = 'fixture-cookie_';
        const infoBar = new InfoBar($infoBar);

        expect(infoBar.$elm.classList.contains('hidden')).to.be.false;

        $infoBar.parentElement.removeChild($infoBar);
        clearFixtureCookie(cookieId, 'false');
      });

    });

  });

});
