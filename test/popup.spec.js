let expect = chai.expect;

// load in component(s) to be tested
let Popup = require('../assets/js/components/Popup');

describe('A Popup Component', function () {
  'use strict';

  let $childElm = document.querySelector('[data-behaviour="Popup"]');
  let popup = new Popup($childElm);

  it('exists', function () {
    expect(popup).to.exist;
  });

  it('popups self', function () {
    let $childElm = document.querySelector('#self-example[data-behaviour="Popup"]');
    let popup = new Popup($childElm);
    popup.$link.click();
    expect(popup.isOpen).to.be.true;
    document.querySelector('body').click();
    expect(popup.isOpen).to.be.false;
  });

  it('wraps and popups self', function () {
    let $childElm = document.querySelector('#self-example-wrapped[data-behaviour="Popup"]');
    let popup = new Popup($childElm);
    popup.$link.click();
    expect(popup.isOpen).to.be.true;
    document.querySelector('body').click();
    expect(popup.isOpen).to.be.false;
  });

});
