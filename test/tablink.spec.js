'use strict';

let expect = chai.expect;
let spy = sinon.spy;

let TabLink = require('../assets/js/components/TabLink');

describe('A TabLink Component', function () {
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="TabLink"]');
  });

  it('uses the "tab-link__active" css class', function () {
    let tabLink = new TabLink($elm);
    expect(tabLink.activeClassName).to.equal('tab-link__active');
  });

  it('has the "tab-link__active" class', function () {
    let _tabLink = new TabLink($elm);
    expect(_tabLink.$elm.querySelector('.tab-link__active')).to.exist;
  });

  it('adds and removes the "tab-link__active" class when inactive tab is clicked', function () {
    let _tabLink = new TabLink($elm);
    let activeTabLink = _tabLink.$elm.querySelector('.tab-link__active');
    let notActiveTabLink = _tabLink.$elm.querySelector('.tab-link:not(.tab-link__active)');
    notActiveTabLink.click();
    expect(activeTabLink.classList.contains('tab-link__active')).to.be.false;
    expect(notActiveTabLink.classList.contains('tab-link__active')).to.be.true;
  });

  it('adds and removes the "tab-link__active" class when tab with long text is clicked', function () {
    let _tabLink = new TabLink($elm);
    let activeTabLink = _tabLink.$elm.querySelector('.tab-link__active');
    let longTabLinkText = _tabLink.$elm.querySelector('.tab-link__long-name');
    longTabLinkText.click();
    expect(activeTabLink.classList.contains('tab-link__active')).to.be.false;
    expect(longTabLinkText.parentNode.classList.contains('tab-link__active')).to.be.true;
  });
});
