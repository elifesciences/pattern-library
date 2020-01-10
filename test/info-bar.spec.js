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
    '.generated-fixture-container'
  );
  utils.buildElement('div', ['info-bar__container'], '', $fixture);
  $fixture.dataset.generatedFixture = '';
  return $fixture;
}

function generateHTMLFixtureWithCookieDetails(id, expires) {
  'use strict';

  const $fixture = generateHTMLFixture();
  $fixture.dataset.cookieNameRoot = getFixtureCookieNameRoot();

  if (id) {
    $fixture.setAttribute('id', id);
  }

  if (expires) {
    $fixture.dataset.cookieExpires = expires;
  }

  return $fixture;
}


function removeAllGeneratedHTMLFixtures() {
  'use strict';

  [].forEach.call(
    document.querySelectorAll('[data-generated-fixture]'),
    function ($element) {
      $element.parentElement.removeChild($element);
  });

}

function setFixtureCookie(id, value) {
  'use strict';

  let val = 'true';
  if (value) {
    val = value;
  }
  const fixtureCookieNameRoot = getFixtureCookieNameRoot();
  document.cookie = `${fixtureCookieNameRoot}${id}=${val}; expires=expires=Tue, 19 January 2038 03:14:07 UTC; path=/;`;
  expect(utils.getCookieValue(`${fixtureCookieNameRoot}${id}`, document.cookie), 'cookie should be set').to.equal(val);
}

function clearFixtureCookie(id, value) {
  'use strict';

  let val = 'true';
  if (value) {
    val = value;
  }
  const fixtureCookieNameRoot = getFixtureCookieNameRoot();
  document.cookie = `${fixtureCookieNameRoot}${id}=${val}; expires=expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/;`;
  expect(utils.getCookieValue(`${fixtureCookieNameRoot}${id}`, document.cookie), 'cookie shouldn\'t be set').to.equal('');
}

function getRandomId() {
  'use strict';

  return `id-${Math.floor(Math.random() * 10000)}`;
}

function getFixtureCookieNameRoot() {
  'use strict';

  return 'fixture-cookie_';
}

describe('A dismissible InfoBar Component', function () {
  'use strict';

  afterEach(function() {
    removeAllGeneratedHTMLFixtures();
  });

  it('is hidden immediately if a cookie indicates it was previously dismissed', function () {
    const id = getRandomId();
    setFixtureCookie(id);

    const $infoBar = generateHTMLFixtureWithCookieDetails(id);
    const infoBar = new InfoBar($infoBar);
    expect(infoBar.$elm.classList.contains('hidden')).to.be.true;

    clearFixtureCookie(id);
  });

  it('is not hidden immediately if no cookie indicates it was previously dismissed', function () {
    const $infoBar = generateHTMLFixture();
    const infoBar = new InfoBar($infoBar);
    expect(infoBar.$elm.classList.contains('hidden')).to.be.false;
  });

  it('has a dismiss button', function () {
    const $infoBar = generateHTMLFixture();
    const infoBar = new InfoBar($infoBar);
    const $button = infoBar.dismiss.$button;
    expect($button.classList.contains('dismiss-button')).to.be.true;
  });

  describe('dismiss button', function () {

    it('is a child of .info-bar__container', function () {
      const infoBar = new InfoBar(generateHTMLFixture());
      const $button = infoBar.dismiss.$button;
      expect($button.parentElement.classList.contains('info-bar__container')).to.be.true;
    });

    context('when clicked', function () {

      it('adds CSS class "hidden" to the info bar', function () {
        const $infoBar = generateHTMLFixture();
        const infoBar = new InfoBar($infoBar);
        const $button = infoBar.dismiss.$button;
        expect($infoBar.classList.contains('hidden')).to.be.false;
        $button.click();
        expect($infoBar.classList.contains('hidden')).to.be.true;
      });

      it('sets a cookie', function () {
        const id = getRandomId();
        expect(utils.getCookieValue(`fixture-cookie_${id}`, document.cookie), 'cookie should not be set').to.equal('');

        const infoBar = new InfoBar(generateHTMLFixtureWithCookieDetails(id));
        infoBar.dismiss.$button.click();

        expect(utils.getCookieValue(`fixture-cookie_${id}`, document.cookie)).to.equal('true');
      });

      context('the cookie it sets', function () {

        describe('name', function () {

          it('is derived from the HTML element\'s id and data-cookie-name-root attribute', function () {
            const id = getRandomId();
            const infoBar = new InfoBar(generateHTMLFixtureWithCookieDetails(id));
            infoBar.dismiss.$button.click();
            expect(infoBar.dismiss.cookieName).to.equal(`fixture-cookie_${id}`);
            expect(utils.getCookieValue(`fixture-cookie_${id}`, document.cookie)).to.equal('true');
          });

          it('is empty if the HTML element lacks an id', function () {
            const $infoBar = generateHTMLFixture();
            $infoBar.dataset.cookieNameRoot = 'fixture-cookie_';

            const infoBar = new InfoBar($infoBar);
            expect(infoBar.dismiss.cookieName).to.equal('');

            $infoBar.parentElement.removeChild($infoBar);
          });

          it('is empty if the HTML element lacks a data-cookie-name-root attribute', function () {
            const id = getRandomId();
            const $infoBar = generateHTMLFixtureWithCookieDetails(id);
            delete $infoBar.dataset.cookieNameRoot;

            const infoBar = new InfoBar($infoBar);
            expect(infoBar.dismiss.cookieName).to.equal('');

            $infoBar.parentElement.removeChild($infoBar);
          });

        });

        describe('expiry date', function () {

          it('is configured with the value of data-cookie-expires HTML attribute, if set', function () {
            const id = getRandomId();
            const expiry = 'Tue, 19 January 2038 03:14:07 UTC';
            const infoBar = new InfoBar(generateHTMLFixtureWithCookieDetails(id, expiry));
            expect(infoBar.dismiss.cookieExpiryDate).to.equal(expiry);

            clearFixtureCookie(id);
          });

          it('is configured with a day offset of the value of data-cookie-duration HTML attribute, if set', function () {
            const id = getRandomId();

            // 7 days in the future
            let expiry = new Date(new Date());
            expiry.setDate(expiry.getDate() + 7);
            expiry = expiry.toUTCString();

            const $infoBar = generateHTMLFixtureWithCookieDetails(id, expiry);

            const infoBar = new InfoBar($infoBar);
            const actualExpiry = (new Date(infoBar.dismiss.cookieExpiryDate)).toUTCString();
            expect(actualExpiry).to.equal(expiry);

            clearFixtureCookie(id);
          });

        });

      });

    });

  });

});
