let expect = chai.expect;

// load in component(s) to be tested
let ContentHeaderSelectNav = require('../assets/js/components/ContentHeaderSelectNav');

describe('A ContentHeaderSelectNav Component', function () {
  "use strict";

  let $el = document.querySelector('[data-behaviour="ContentHeaderSelectNav"]');
  let contentHeaderSelectNav;

  beforeEach(function () {
    contentHeaderSelectNav = new ContentHeaderSelectNav($el, window, window.document);
  });

  it('exists', function () {
    expect(contentHeaderSelectNav).to.exist;
  });

});
