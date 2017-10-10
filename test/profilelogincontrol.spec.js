let expect = chai.expect;

// load in component(s) to be tested
let ProfileLoginControl = require('../assets/js/components/ProfileLoginControl');


describe('A ProfileLoginControl Component', function () {
  'use strict';
  let $elm;
  let profileLoginControl;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="ProfileLoginControl"]');
    profileLoginControl = new ProfileLoginControl($elm);

  });

  it('exists', function () {
    expect(ProfileLoginControl).to.exist;
  });

  xit('has a displayName property', () => {
    const originalDisplayName = $elm.dataset.displayName;
    const newDisplayName = 'I am the display name';
    $elm.dataset.displayName = newDisplayName;
    const profileLoginControl = new ProfileLoginControl($elm);
    expect(profileLoginControl.displayName).to.equal(newDisplayName);
    $elm.dataset.displayName = originalDisplayName;
  });

  xit('has a profileHomeLink property', () => {
    const originalProfileHomeLink = $elm.dataset.profileHomeLink;
    const newProfileHomeLink = 'I am the profile home link';
    $elm.dataset.profileHomeLink = newProfileHomeLink;
    const profileLoginControl = new ProfileLoginControl($elm);
    expect(profileLoginControl.profileHomeLink).to.equal(newProfileHomeLink);
    $elm.dataset.profileHomeLink = originalProfileHomeLink;
  });

  // TODO: Move to Selenium
  xit('has a data-link-fields attribute [move to Selenium]');
  describe('data-link-fields attribute [move to Selenium]', () => {
    xit('has the value "profileManager, logout"');
    describe('a field in the data-link-fields attribute value', () => {
      xit('identifies a present corresponding data attribute value with the "-uri" suffix');
      xit('identifies a present corresponding data attribute value with the "-text" suffix');
    });
  });

});
