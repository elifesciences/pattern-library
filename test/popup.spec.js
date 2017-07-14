let expect = chai.expect;

// load in component(s) to be tested
let Popup = require('../assets/js/components/Popup');

describe('A Popup Component', function () {
  'use strict';

  let $childElm = document.querySelector('[data-behaviour="Popup"]');
  let windowMock = {
    "location": {
      "host": "",
      "href": "",
    },
    "matchMedia": function() { return { "matches": true }; },
    "addEventListener": function() {},
    "document": document,
  };

  let linkClick = function(popup) {
    popup.handleLinkClick({ preventDefault: () => {}});
  };
  let documentClick = function(popup) {
    popup.handleDocumentClick({ preventDefault: () => {}, target: document.body});
  };

  it('exists', function () {
    let popup = new Popup($childElm, windowMock);
    expect(popup).to.exist;
  });

  it('popups a separate element', function () {
    let $childElm = document.querySelector('#example[data-behaviour="Popup"]');
    let popup = new Popup($childElm, windowMock);
    linkClick(popup);
    expect(popup.isOpen).to.be.true;
    documentClick(popup);
    expect(popup.isOpen).to.be.false;
  });

  it('popups self', function () {
    let $childElm = document.querySelector('#self-example[data-behaviour="Popup"]');
    let popup = new Popup($childElm, windowMock);
    linkClick(popup);
    expect(popup.isOpen).to.be.true;
    documentClick(popup);
    expect(popup.isOpen).to.be.false;
  });

  it('wraps and popups self', function () {
    let $childElm = document.querySelector('#self-example-wrapped[data-behaviour="Popup"]');
    let popup = new Popup($childElm, windowMock);
    linkClick(popup);
    expect(popup.isOpen).to.be.true;
    documentClick(popup);
    expect(popup.isOpen).to.be.false;
  });

});
