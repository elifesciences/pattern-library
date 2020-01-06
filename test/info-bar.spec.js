const utils = require('../assets/js/libs/elife-utils')();
const chai = require('chai');

const expect = chai.expect;

// load in component(s) to be tested
const InfoBar = require('../assets/js/components/InfoBar');

//If there is not a cookie name then dismiss.hide is called
//If there is a cookie name and does not have a value of true then dismiss.hide is not called


describe('An InfoBar Component', function () {
  'use strict';

  it ('calls dismiss.hide if there is not a cookie name', function() {
    const $noId = utils.buildElement('div', ['info-bar', 'info-bar--dismissible'], '',  '.fixture-container');
    $noId.dataset.cookieNameRoot = 'theRootOfTheCookieName_';
    const infoBarNoId = new InfoBar($noId);

    const $noCookieNameRoot = utils.buildElement('div', ['info-bar', 'info-bar--dismissible'], '',  '.fixture-container');
    $noCookieNameRoot.setAttribute('id', 'idWhenNoCookieNameRoot');
    const infoBarNoCookieNameRoot = new InfoBar($noCookieNameRoot);

    const $noIdNorCookieNameRoot = utils.buildElement('div', ['info-bar', 'info-bar--dismissible'], '',  '.fixture-container');
    const infoBarNoIdNorCookieNameRoot = new InfoBar($noIdNorCookieNameRoot);

    // const infoBar = new InfoBar($elm);
  });

});
