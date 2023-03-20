'use strict';

let expect = chai.expect;
let spy = sinon.spy;

let TabMenu = require('../assets/js/components/TabMenu');

describe('A TabMenu Component', function () {
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="TabMenu"]');
  });

  it('uses the "tab-menu__active" css class', function () {
    let tabMenu = new TabMenu($elm);
    expect(tabMenu.activeClassName).to.equal('tab-menu__active');
  });

  it('has the "tab-menu__active" class', function () {
    let _tabMenu = new TabMenu($elm);
    expect(_tabMenu.$elm.querySelector('.tab-menu__active')).to.exist;
  });

  it('adds and removes the "tab-menu__active" class when inactive tab is clicked', function () {
    let _tabMenu = new TabMenu($elm);
    let activeTabMenu = _tabMenu.$elm.querySelector('.tab-menu__active');
    let notActiveTabMenu = _tabMenu.$elm.querySelector('.tab-menu:not(.tab-menu__active)');
    notActiveTabMenu.click();
    expect(activeTabMenu.classList.contains('tab-menu__active')).to.be.false;
    expect(notActiveTabMenu.classList.contains('tab-menu__active')).to.be.true;
  });

  it('adds and removes the "tab-menu__active" class when tab with long text is clicked', function () {
    let _tabMenu = new TabMenu($elm);
    let activeTabMenu = _tabMenu.$elm.querySelector('.tab-menu__active');
    let longTabMenuText = _tabMenu.$elm.querySelector('.tab-menu__long-name');
    longTabMenuText.click();
    expect(activeTabMenu.classList.contains('tab-menu__active')).to.be.false;
    expect(longTabMenuText.parentNode.classList.contains('tab-menu__active')).to.be.true;
  });
});
