let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let AudioPlayer = require('../assets/js/components/AudioPlayer');

describe('An AudioPlayer Component', function () {
  'use strict';
  let $elm = document.querySelector('.audio-player');
  let player;
  let $mediaMock;
  let times;

  beforeEach(function () {
    player = new AudioPlayer($elm);
    $mediaMock = {
      play: spy(),
      pause: spy(),
      currentTime: -1
    };
    times = [
      {numSecs: '30', asStr: '0:30'},
      {numSecs: '60', asStr: '1:00'},
      {numSecs: '90', asStr: '1:30'},
      {numSecs: '123', asStr: '2:03'},
      {numSecs: '300', asStr: '5:00'},
      {numSecs: '600', asStr: '10:00'},
      {numSecs: '754', asStr: '12:34'}
    ];

  });

  afterEach(function () {
    player = null;
    $mediaMock = null;
  });

  it('exists', function () {
    expect(player).to.not.equal(null);
  });

  it('contains an audio element', function () {
    // Checking the real thing actually exists, so no mock here.
    expect(player.$audioElement['tagName']).to.equal('AUDIO');
  });

  it('initialises in a paused state', function () {
    expect(player.isPlaying).to.be.false;
  });

  it('possesses a togglePlay() method', function () {
    expect(typeof player.togglePlay).to.equal('function');
  });

  describe('the togglePlay() method', function() {
    it('plays audio if invoked when paused', function () {
      player.isPlaying = false;
      expect(player.isPlaying).to.be.false;
      player.togglePlay($mediaMock);
      expect(player.isPlaying).to.be.true;
      expect($mediaMock.play.calledOnce).to.be.true;
      expect($mediaMock.pause.called).to.be.false;
    });

    it('pauses audio if invoked whilst playing', function () {
      player.isPlaying = true;
      expect(player.isPlaying).to.be.true;
      player.togglePlay($mediaMock);
      expect(player.isPlaying).to.be.false;
      expect($mediaMock.pause.calledOnce).to.be.true;
      expect($mediaMock.play.called).to.be.false;
    });
  });

  it('possesses a secondsToMinutes() static method', function () {
    expect(typeof AudioPlayer.secondsToMinutes).to.equal('function');
  });
  
  describe('the secondsToMinutes() static method', function () {
    it('returns correctly formatted [m]m:ss string when given a time in seconds', function () {
      times.forEach(time => {
        expect(AudioPlayer.secondsToMinutes(time.numSecs)).to.equal(time.asStr);
      });
    });
  });

  it('possesses a seek() method', function () {
    expect(typeof player.seek).to.equal('function');
  });

  describe('the seek() method', function () {
    it('sets the audio\'s correct current time based on its time argument', function () {
      times.forEach(time => {
        var secs = parseInt(time.numSecs, 10);
        player.seek(secs, $mediaMock);
        expect($mediaMock.currentTime).to.equal(secs);
      });
    });
  });

});

