let expect = chai.expect;

let CookieOverlay = require('../assets/js/components/CookieOverlay');

describe('A CookieOverlay Component', function () {
  'use strict';
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="CookieOverlay"]');
    document.cookie = 'cookieNotificationAccepted=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
    window.elifeConfig = {
      'domain': 'localhost',
    }
  });
  
  afterEach(() => {
    delete window.elifeConfig;
  });

  it('is not accepted by default', function () {
    let cookieOverlay = new CookieOverlay($elm, window);
    expect(cookieOverlay.previouslyAccepted()).to.be.false;
  });

  it('may be accepted by the user', function () {
    let cookieOverlay = new CookieOverlay($elm, window);
    cookieOverlay.accept();
    expect(cookieOverlay.cookieString).to.equal('cookieNotificationAccepted=true; expires=Tue, 19 January 2038 03:14:07 UTC; path=/; domain=localhost;');
  });

  it('assumes a default domain if empty', function () {
    window.elifeConfig.domain = '';
    let cookieOverlay = new CookieOverlay($elm, window);
    cookieOverlay.accept();
    expect(cookieOverlay.cookieString).to.contain('domain=elifesciences.org;');
  });

  it('assumes a default domain if not configured', function () {
    delete window.elifeConfig;
    let cookieOverlay = new CookieOverlay($elm, window);
    cookieOverlay.accept();
    expect(cookieOverlay.cookieString).to.contain('domain=elifesciences.org;');
  });
});
