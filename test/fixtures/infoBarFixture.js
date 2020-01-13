'use strict';

const utils = require('../../assets/js/libs/elife-utils')();

module.exports = (function () {

  const generateHTML = () => {
    const $fixture = utils.buildElement(
      'div',
      ['info-bar',
       'info-bar--dismissible'],
      '',
      document.querySelector('body')
    );
    utils.buildElement('div', ['info-bar__container'], '', $fixture);
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

  const removeAllGeneratedHTMLFixtures = () => {

    [].forEach.call(
      document.querySelectorAll('[data-generated-fixture]'),
      function ($element) {
        $element.parentElement.removeChild($element);
      });

  };

  const getFixtureCookieNameRoot = () => {
    return 'fixture-cookie_';
  };

  const setFixtureCookie = function (id, value) {
    document.cookie = `${getFixtureCookieNameRoot()}${id}=${value}; expires=expires=Tue, 19 January 2038 03:14:07 UTC; path=/;`;
  };

  const clearFixtureCookie = (id) => {
    document.cookie = `${getFixtureCookieNameRoot()}${id}=true; expires=expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/;`;
  };

  return {
    generateHTML,
    generateHTMLWithCookieDetails,
    removeAllGeneratedHTMLFixtures,
    getFixtureCookieNameRoot,
    setFixtureCookie,
    clearFixtureCookie,
  };

}());
