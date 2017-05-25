let expect = chai.expect;

// load in component(s) to be tested
let Popup = require('../assets/js/components/Popup');

describe('A Popup Component', function () {
  'use strict';

  let $childElm = document.querySelector('[data-behaviour="Popup"]');
  let popup = new Popup($childElm);
  let $elm = popup.$elm;

  it('exists', function () {
    expect(popup).to.exist;
  });

});
