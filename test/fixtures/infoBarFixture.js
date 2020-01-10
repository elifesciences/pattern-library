'use strict';

const utils = require('../../assets/js/libs/elife-utils')();

module.exports = () => {

  const generate = () => {
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

  const generateWithCookieDetails = (nameRoot, id, expires) => {
    const $fixture = generate();
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
    generate,
    generateWithCookieDetails,
  };

};
