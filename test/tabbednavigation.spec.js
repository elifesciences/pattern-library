'use strict';

let expect = chai.expect;
let spy = sinon.spy;

let TabbedNavigation = require('../assets/js/components/TabbedNavigation');

describe('A TabbedNavigation Component', function () {
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="TabbedNavigation"]');
  });

  it('uses the "tabbed-navigation__tab-label--active" css class', function () {
    let tabbedNavigation = new TabbedNavigation($elm);
    expect(tabbedNavigation.activeClassName).to.equal('tabbed-navigation__tab-label--active');
  });

  it('has the "tabbed-navigation__tab-label--active" class', function () {
    let _tabbedNavigation = new TabbedNavigation($elm);
    expect(_tabbedNavigation.$elm.querySelector('.tabbed-navigation__tab-label--active')).to.exist;
  });

  it('adds and removes the "tabbed-navigation__tab-label--active" class when inactive tab is clicked', function () {
    let _tabbedNavigation = new TabbedNavigation($elm);
    let activeTabbedNavigation = _tabbedNavigation.$elm.querySelector('.tabbed-navigation__tab-label--active');
    let notActiveTabbedNavigation = _tabbedNavigation.$elm.querySelector('.tabbed-navigation__tab-label:not(.tabbed-navigation__tab-label--active)');
    notActiveTabbedNavigation.click();
    expect(activeTabbedNavigation.classList.contains('tabbed-navigation__tab-label--active')).to.be.false;
    expect(notActiveTabbedNavigation.parentNode.classList.contains('tabbed-navigation__tab-label--active')).to.be.true;
  });

  it('adds and removes the "tabbed-navigation__tab-label--active" class when tab with long text is clicked', function () {
    let _tabbedNavigation = new TabbedNavigation($elm);
    let activeTabbedNavigation = _tabbedNavigation.$elm.querySelector('.tabbed-navigation__tab-label--active');
    let longTabbedNavigationText = _tabbedNavigation.$elm.querySelector('.tabbed-navigation__tab-label--long');
    longTabbedNavigationText.click();
    expect(activeTabbedNavigation.classList.contains('tabbed-navigation__tab-label--active')).to.be.false;
    expect(longTabbedNavigationText.parentNode.parentNode.classList.contains('tabbed-navigation__tab-label--active')).to.be.true;
  });
});
