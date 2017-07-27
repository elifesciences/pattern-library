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

  var popups = [];
  beforeEach(function() {
    popups = [];
  });

  let instantiatePopup = function(selector) {
    let $childElm = document.querySelector(selector);
    let popup = new Popup($childElm, windowMock);
    popups.push(popup);
    return popup;
  }

  let documentClick = function(target) {
    if (target === undefined) {
      target = document.body;
    }
    for (let i in popups) {
      popups[i].handleDocumentClick({ "preventDefault": () => {}, "target": target});
    }
  };
  let linkClick = function(popup) {
    popup.handleLinkClick({ preventDefault: () => {}});
    // event propagates to the document level
    documentClick(popup.$link);
  };

  it('exists', function () {
    let popup = new Popup($childElm, windowMock);
    expect(popup).to.exist;
  });

  it.only('popups a separate element', function () {
    let popup = instantiatePopup('#example[data-behaviour="Popup"]');
    linkClick(popup);
    expect(popup.isOpen).to.be.true;
    documentClick();
    expect(popup.isOpen).to.be.false;
  });

  it('replaces another opened popup', function () {
    let popup = instantiatePopup('#example[data-behaviour="Popup"]');
    let anotherPopup = instantiatePopup('#example-another[data-behaviour="Popup"]');

    linkClick(popup);
    expect(popup.isOpen).to.be.true;
    linkClick(anotherPopup);
    expect(anotherPopup.isOpen).to.be.true;
    //expect(popup.isOpen).to.be.false;
  });

  it('popups self', function () {
    let popup = instantiatePopup('#self-example[data-behaviour="Popup"]');
    linkClick(popup);
    expect(popup.isOpen).to.be.true;
    documentClick();
    expect(popup.isOpen).to.be.false;
  });

  it('wraps and popups self', function () {
    let popup = instantiatePopup('#self-example-wrapped[data-behaviour="Popup"]');
    linkClick(popup);
    expect(popup.isOpen).to.be.true;
    documentClick();
    expect(popup.isOpen).to.be.false;
  });

});
