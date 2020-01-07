const chai = require('chai');
const InfoBar = require('../assets/js/components/InfoBar');
const utils = require('../assets/js/libs/elife-utils')();

const expect = chai.expect;

function setFixtureCookie(value) {
  'use strict';

  const nameRoot = 'fixture-cookie_';
  const id = 'fixtureId';
  const name = `${nameRoot}${id}`;

  document.cookie= `${name}=${value}; expires=Tue, 19 January 2038 03:14:07 UTC; path=/;`;

  return {
    nameRoot,
    id,
  };
}

function clearFixtureCookie() {
  'use strict';

  document.cookie = `fixture-cookie_fixtureId=false; expires=expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/;`;
}

describe('A dismissible InfoBar Component', function () {
  'use strict';

  let $infoBar;

  beforeEach(function () {
    $infoBar = utils.buildElement(
      'div',
      ['info-bar',
       'info-bar--dismissible'],
      '',
      '.fixture-container'
    );
    $infoBar.dataset.generatedFixture = '';
  });

  afterEach(function () {
    [].slice.call(document.querySelectorAll('[data-generated-fixture]')).forEach(function (node) {
      node.parentNode.removeChild(node);
    });
    $infoBar = null;

    clearFixtureCookie();
  });

  describe('has a cookie', function () {

    describe('with a name', function () {

      it('that is derived from the HTML element\'s id and data-cookie-name-root attribute  ', function () {
        $infoBar.dataset.cookieNameRoot = 'some-cookie-name-root_';
        $infoBar.setAttribute('id', 'some-id');

        const infoBar = new InfoBar($infoBar);
        expect(infoBar.dismiss.cookieName).to.equal('some-cookie-name-root_some-id');
      });

      it('that is empty if the HTML element lacks an id', function () {
        $infoBar.dataset.cookieNameRoot = 'some-cookie-name-root';

        const infoBar = new InfoBar($infoBar);
        expect(infoBar.dismiss.cookieName).to.equal('');
      });

      it('that is empty if the HTML element lacks a data-cookie-name-root attribute', function () {
        $infoBar.setAttribute('id', 'some-id');

        const infoBar = new InfoBar($infoBar);
        expect(infoBar.dismiss.cookieName).to.equal('');
      });

      it('that when empty does not hide the info bar', function() {
        const infoBar = new InfoBar($infoBar);
        expect(infoBar.$elm.classList.contains('hidden')).to.be.false;
      });

    });

    describe('with an expiry date', function () {

      context('that when the HTML attribute data-cookie-expires has a value', function () {

        it('is set to that date', function () {
          debugger;
          expect(utils.getCookieValue('fixture-cookie_fixtureId', document.cookie), 'cookie shouldn\'t be set yet').to.equal('');
          const expectedExpiry = 'Tue, 19 January 2038 03:14:07 UTC';
          $infoBar.dataset.cookieExpires = expectedExpiry;
          new InfoBar($infoBar);
          expect(utils.getCookieValue('fixture-cookie_fixtureId', document.cookie), 'cookie not set').to.equal(true);

          let actualExpiry = '';
          document.cookie.split('; ').forEach((cookie) => {
            if (cookie.indexOf('fixture-cookie_fixtureId') === 0) {
              const re = new RegExp(`expiry=([^;]*)`);
              const cookieMatch = cookie.match(re)[1];
              actualExpiry = decodeURIComponent(cookieMatch);
            }
          });

          expect(actualExpiry).to.equal(expectedExpiry);

        });

      });

      context('that when the HTML attribute data-cookie-duration is set as an integer', function () {

        xit('is set to that date that number of days in the future');

      });

    });

    describe('that if already exists with the value "true"', function () {

      let cookieNameParts;

      beforeEach(function() {
        cookieNameParts = setFixtureCookie('true');
      });

      it('hides the info bar', function () {
        $infoBar.setAttribute('id', cookieNameParts.id);
        $infoBar.dataset.cookieNameRoot = cookieNameParts.nameRoot;
        const infoBar = new InfoBar($infoBar);

        expect(infoBar.$elm.classList.contains('hidden')).to.be.true;
      });

    });

    describe('that if already exists with a value that is not "true"', function () {

      let cookieNameParts;

      beforeEach(function() {
        cookieNameParts = setFixtureCookie('false');
      });

      it('doesn\'t hide the info bar', function () {
        $infoBar.setAttribute('id', cookieNameParts.id);
        $infoBar.dataset.cookieNameRoot = cookieNameParts.nameRoot;
        const infoBar = new InfoBar($infoBar);

        expect(infoBar.$elm.classList.contains('hidden')).to.be.false;
      });

    });

  });

});
