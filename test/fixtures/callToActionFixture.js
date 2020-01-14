'use strict';

const dismissible = require('./_dismissibleFixture');
const utils = require('../../assets/js/libs/elife-utils')();

module.exports = (function () {

  const generateHTML = () => {
    const $fixture = utils.buildElement(
      'div',
      [
        'call-to-action-wrapper',
        'call-to-action-wrapper--needs-js'
      ],
      '',
      document.querySelector('body')
    );

    const $callToAction = utils.buildElement(
      'div',
      ['call-to-action'],
      '',
      $fixture
    );

    utils.buildElement(
      'div',
      ['call-to-action__button_wrapper'],
      '',
      $callToAction
    );

    $fixture.dataset.generatedFixture = '';
    return $fixture;
  };

  const generateHTMLWithCookieDetails = (nameRoot, id, expires) => {
    const $fixture = generateHTML();
    $fixture.dataset.cookieNameRoot = nameRoot;

    if (id) {
      $fixture.setAttribute('id', id);
    }

    if (expires) {
      $fixture.dataset.cookieExpires = expires;
    }

    return $fixture;
  };

  return {
    generateHTML,
    generateHTMLWithCookieDetails,
    removeAllGeneratedHTMLFixtures: dismissible.removeAllGeneratedHTMLFixtures,
    generateRandomId: dismissible.generateRandomId,
    getCookieNameRoot: dismissible.getCookieNameRoot,
    setFixtureCookie: dismissible.setFixtureCookie,
    clearCookie: dismissible.clearCookie,
  };

}());
