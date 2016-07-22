let expect = chai.expect;

// load in component(s) to be tested
let SelectNav = require('../assets/js/components/SelectNav');

describe('A SelectNav Component', function () {
  "use strict";

  let $el = document.querySelector('[data-behaviour="SelectNav"]');
  let selectNav;

  beforeEach(function () {
    selectNav = new SelectNav($el, window, window.document);
  });

  it('exists', function () {
    expect(selectNav).to.exist;
  });

});
