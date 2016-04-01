"use strict";

let expect = chai.expect;

// load in component(s) to be tested
let AudioPlayer = require('../assets/js/components/AudioPlayer');

describe('AudioPlayer Component', function () {
  let $elm = document.querySelector('.audio-player');
  let player;

  beforeEach(function() {
    player = new AudioPlayer($elm);
  });

  it('exists', function () {
    expect(player).to.not.equal(null);
  });

});
