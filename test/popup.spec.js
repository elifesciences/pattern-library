let expect = chai.expect;

// load in component(s) to be tested
let Popup = require('../assets/js/components/Popup');

describe('A Popup Component', function () {
  'use strict';

  let $childElm = document.querySelector('[data-behaviour="Popup"]');
  let windowMock = {
    "location": {
      "host": ""
    },
    "matchMedia": function() { return { "matches": true }; },
    "addEventListener": function() {},
  };

  it('exists', function () {
    let popup = new Popup($childElm, windowMock);
    expect(popup).to.exist;
  });

  it('popups self', function () {
    let $childElm = document.querySelector('#self-example[data-behaviour="Popup"]');
    let popup = new Popup($childElm, windowMock);
    popup.handleLinkClick({ preventDefault: () => {}});
    expect(popup.isOpen).to.be.true;
    popup.handleDocumentClick({ preventDefault: () => {}, target: document.body});
    expect(popup.isOpen).to.be.false;
  });

  it('wraps and popups self', function () {
    let $childElm = document.querySelector('#self-example-wrapped[data-behaviour="Popup"]');
    let popup = new Popup($childElm, windowMock);
    popup.handleLinkClick({ preventDefault: () => {}});
    expect(popup.isOpen).to.be.true;
    popup.handleDocumentClick({ preventDefault: () => {}, target: document.body});
    expect(popup.isOpen).to.be.false;
  });

});
