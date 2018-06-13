let expect = chai.expect;

let CookieOverlay = require('../assets/js/components/CookieOverlay');

describe('A CookieOverlay Component', function () {
  'use strict';
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="CookieOverlay"]');
    document.cookie = 'cookieNotificationAccepted=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
  });

  it('is not accepted by default', function () {
    let cookieOverlay = new CookieOverlay($elm);
    expect(cookieOverlay.previouslyAccepted()).to.be.false;
  });

  it('may be accepted by the user', function () {
    let cookieOverlay = new CookieOverlay($elm);
    cookieOverlay.accept();
    expect(cookieOverlay.previouslyAccepted()).to.be.true;
  });
});
