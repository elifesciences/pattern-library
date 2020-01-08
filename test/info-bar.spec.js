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

describe('A dismissible InfoBar Component', function () {
  'use strict';

  // afterEach(function () {
  //   [].slice.call(document.querySelectorAll('[data-generated-fixture]')).forEach(function (node) {
  //     node.parentNode.removeChild(node);
  //   });
  //   $infoBar = null;
  //
  //   clearFixtureCookie();
  // });

  describe('has a cookie', function () {

    describe('with a name', function () {

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

      it('that when empty does not hide the info bar', function() {
        const $infoBar = generateHTMLFixture();
        const infoBar = new InfoBar($infoBar);
        expect(infoBar.$elm.classList.contains('hidden')).to.be.false;

        $infoBar.parentElement.removeChild($infoBar);
      });

    });

    describe('a desired expiry date', function () {

      context('that when the HTML attribute data-cookie-expires has a value', function () {

        it('is configured to set to that as the cookie expiry date', function () {
          const cookieUid = Math.floor(Math.random() * 10000);
          document.cookie = `fixture-cookie_${cookieUid}=false; expires=expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/;`;

          expect(utils.getCookieValue(`fixture-cookie_${cookieUid}`, document.cookie), 'cookie shouldn\'t be set yet').to.equal('');

          const expectedExpiry = 'Tue, 19 January 2038 03:14:07 UTC';

          const $infoBar = generateHTMLFixture();
          $infoBar.setAttribute('id', cookieUid.toString());
          $infoBar.dataset.cookieNameRoot = 'fixture-cookie_';
          $infoBar.dataset.cookieExpires = expectedExpiry;
          const infoBar = new InfoBar($infoBar);
          expect(infoBar.dismiss.cookieExpiryDate).to.equal(expectedExpiry);

          $infoBar.parentElement.removeChild($infoBar);
          document.cookie = `fixture-cookie_${cookieUid}=false; expires=expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/;`;

        });

      });

      context('that when the HTML attribute data-cookie-duration is set as an integer', function () {

        xit('is set to that date that number of days in the future');

      });

    });

    describe('that if already exists with the value "true"', function () {

      let cookieNameParts;

      beforeEach(function() {
        // cookieNameParts = setFixtureCookie('true');
      });

      it('hides the info bar', function () {
        const $infoBar = generateHTMLFixture();
        $infoBar.setAttribute('id', cookieNameParts.id);
        $infoBar.dataset.cookieNameRoot = cookieNameParts.nameRoot;
        const infoBar = new InfoBar($infoBar);

        expect(infoBar.$elm.classList.contains('hidden')).to.be.true;

        $infoBar.parentElement.removeChild($infoBar);
      });

    });

    describe('that if already exists with a value that is not "true"', function () {

      let cookieNameParts;

      beforeEach(function() {
        // cookieNameParts = setFixtureCookie('false');
      });

      it('doesn\'t hide the info bar', function () {
        const $infoBar = generateHTMLFixture();
        $infoBar.setAttribute('id', cookieNameParts.id);
        $infoBar.dataset.cookieNameRoot = cookieNameParts.nameRoot;
        const infoBar = new InfoBar($infoBar);

        expect(infoBar.$elm.classList.contains('hidden')).to.be.false;

        $infoBar.parentElement.removeChild($infoBar);
      });

    });

  });

});
