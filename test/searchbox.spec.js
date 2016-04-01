"use strict";

let expect = chai.expect;

// load in component(s) to be tested
let Searchbox = require('../assets/js/components/SearchBox');

describe('SearchBox Component', function () {

  it('exists', function () {

    let sb = new Searchbox();
    expect(sb).to.not.equal(null);

  });

});
