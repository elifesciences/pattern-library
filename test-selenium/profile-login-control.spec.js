'use strict';
const expect = require('chai').expect;

describe('A login control', function() {

  let loginControl;

  before(function () {
    browser.url('/patterns/01-molecules-navigation-login-control-logged-in/01-molecules-navigation-login-control-logged-in.html')
    loginControl = browser.element('.login-control');
  });

  it('has the correct behaviour assigned', () => {
    expect(loginControl.getAttribute('data-behaviour')).to.equal('LoginControl');
  });

  it('has a populated data-display-name attribute', () => {
    const attribute = loginControl.getAttribute('data-display-name');
    expect(attribute).to.be.a('string');
    expect(attribute.length).to.be.above(0);
  });

  it('has a populated data-link-field-roots attribute', () => {
    const attribute = loginControl.getAttribute('data-link-field-roots');
    expect(attribute).to.be.a('string');
    expect(attribute.split(',').length).to.be.above(1);
  });

  describe('the login control menu/icon interaction', () => {

    let icon;
    let menu;

    before(function () {
      icon = loginControl.element('.login-control__icon');
      menu = loginControl.element('.login-control__controls');
    });

    context('before clicking on the icon', () => {

      it('the menu is hidden', function () {
        expect(menu.getAttribute('class')).to.contain('hidden');
      });

    });

    context('when menu is hidden', () => {

      it('clicking on the icon once displays the menu', () => {
        icon.click();
        expect(menu.getAttribute('class')).not.to.contain('hidden');
      });

    });

    context('when the menu is visible', () => {

      beforeEach(() => {
        if (menu.getAttribute('class').indexOf('hidden') > -1) {
          icon.click();
          expect(menu.getAttribute('class')).not.to.contain('hidden');
        }
      });

      it('clicking the icon hides the menu', () => {
        icon.click();
        expect(menu.getAttribute('class')).to.contain('hidden');
      });

      it('clicking inside the menu does not hide the menu', () => {
        menu.click();
        expect(menu.getAttribute('class')).not.to.contain('hidden');
      });

      it('clicking outside both the icon and the menu hides the menu', () => {
        browser.element('body').click();
        expect(menu.getAttribute('class')).to.contain('hidden');
      });

      it('the name in the menu has the same value as the data-display-name attribute', () => {
        const expected = loginControl.getAttribute('data-display-name');
        expect(loginControl.element('.login-control__display_name').getText()).to.equal(expected);
      });

    });

  });

});
