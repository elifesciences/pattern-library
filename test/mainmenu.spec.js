let expect = chai.expect;

// load in component(s) to be tested
let MainMenu = require('../assets/js/components/MainMenu');

describe('A MainMenu Component', function () {
  'use strict';
  let $elm;
  let mainMenu;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="MainMenu"]');
    mainMenu = new MainMenu($elm);
  });

  afterEach(function () {
    $elm = null;
    mainMenu = null;
  });

  it('exists', function () {
    expect(mainMenu).to.exist;
  });


});
