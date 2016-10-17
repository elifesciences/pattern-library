let expect = chai.expect;

// load in component(s) to be tested
let ViewSelector = require('../assets/js/components/ViewSelector');

describe('A ViewSelector Component', function () {
  'use strict';
  let $elm;
  let viewSelector;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="ViewSelector"]');
    viewSelector = new ViewSelector($elm);
  });

});
