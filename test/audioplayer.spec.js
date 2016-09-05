// Needed until Phantom supports Promise:
require('es6-promise').polyfill();

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
  let windowMock;

  beforeEach(function () {
    windowMock = {
      HTMLAudioElement: true,
      addEventListener: function () {}
    };
    player = new AudioPlayer($elm, windowMock);
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
    times = null;
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

  describe('the togglePlay() method', function () {

    let $togglePlayButtonMock;

    beforeEach(function () {
      $togglePlayButtonMock = {
        classList: {
          add: spy(),
          remove: spy()
        }
      };
    });

    afterEach(function (){
      $togglePlayButtonMock = null;
    });

    it('plays audio if invoked when paused', function () {
      player.isPlaying = false;
      expect(player.isPlaying).to.be.false;
      player.togglePlay($mediaMock, $togglePlayButtonMock);
      expect(player.isPlaying).to.be.true;
      expect($mediaMock.play.calledOnce).to.be.true;
      expect($mediaMock.pause.called).to.be.false;
    });

    it('pauses audio if invoked whilst playing', function () {
      player.isPlaying = true;
      expect(player.isPlaying).to.be.true;
      player.togglePlay($mediaMock, $togglePlayButtonMock);
      expect(player.isPlaying).to.be.false;
      expect($mediaMock.pause.calledOnce).to.be.true;
      expect($mediaMock.play.called).to.be.false;
    });

    it('removes button\'s play css class and adds pause css class when playback started', function () {
      player.isPlaying = false;
      player.togglePlay($mediaMock, $togglePlayButtonMock);
      expect($togglePlayButtonMock.classList.add.calledWith('audio-player__toggle_play--pauseable')).to.be.true;
      expect($togglePlayButtonMock.classList.remove.calledWith('audio-player__toggle_play--playable')).to.be.true;
    });

    it('removes button\'s pause css class and adds play css class when playback paused', function () {
      player.isPlaying = true;
      player.togglePlay($mediaMock, $togglePlayButtonMock);
      expect($togglePlayButtonMock.classList.remove.calledWith('audio-player__toggle_play--pauseable')).to.be.true;
      expect($togglePlayButtonMock.classList.add.calledWith('audio-player__toggle_play--playable')).to.be.true;
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

  it('possesses an updateIconState() static method', function () {
    expect(AudioPlayer.updateIconState).to.be.a('function');
  });

  describe('the updateIconState() static method', function () {

    var $iconMock;

    beforeEach(function () {
      $iconMock = {
        src: '',
        alt: ''
      };
    });

    afterEach(function () {
      $iconMock = null;
    });

    it('sets the correct attributes for the play icon when invoked with "play" ', function () {
      AudioPlayer.updateIconState($iconMock, 'play');
      expect($iconMock.src).to.equal('../../assets/img/icons/audio-play.svg');
      expect($iconMock.alt).to.equal('play');
    });

    it('sets the correct attributes for the pause icon when invoked with "pause" ', function () {
      AudioPlayer.updateIconState($iconMock, 'pause');
      expect($iconMock.src).to.equal('../../assets/img/icons/audio-pause.svg');
      expect($iconMock.alt).to.equal('pause');
    });

    it('sets no attributes if passed neither "play" nor "pause" ', function () {
      var invalidValues = ['invalid', 1234, ['play'], {play: 'play'}, ['pause'], {pause: 'pause'}];
      invalidValues.forEach(invalidValue => {
        AudioPlayer.updateIconState($iconMock, invalidValue);
        expect($iconMock.src).to.equal('');
        expect($iconMock.alt).to.equal('');
      });

    });

  });

  it('possesses a prepareChapterMetadata() method', function () {
    expect(typeof player.prepareChapterMetadata).to.equal('function');
  });

  describe('the prepareChapterMetadata() method', function () {

    let returnValue;

    beforeEach(function () {
      let sampleMetadata = {
        "number": 21,
        "title": "June 2015",
        "chapters": [
          {
            "number": 1,
            "title": "What causes tinnitus?",
            "time": 36,
          },
          {
            "number": 2,
            "title": "How salamanders avoid senescence",
            "time": 386
          },
          {
            "number": 3,
            "title": "Mouse ultrasound",
            "time": 700
          },
          {
            "number": 4,
            "title": "Drosophila duet: mating flies harmonise",
            "time": 1010
          },
          {
            "number": 5,
            "title": "Chemical Harpoons: bacterial anchors",
            "time": 1307
          }

        ]
      };

      returnValue = player.prepareChapterMetadata(sampleMetadata);
    });

    it('returns an array', function () {
      expect(returnValue).is.an.array;
    });

    it('returns an array of objects, each with 3 properties', function () {
      returnValue.forEach(function (value) {
        expect(Object.keys(value).length).to.equal(3);
      });

    });

    it('returns array element objects containing a time property that is a number', function () {
      returnValue.forEach(function (element) {
        expect(!isNaN(element.time)).to.be.true;
      });
    });

    it('returns array element objects containing a number property that is a number', function () {
      returnValue.forEach(function (element) {
        expect(!isNaN(element.number)).to.be.true;
      });
    });

    it('returns array element objects containing a title property that is a string', function () {
      returnValue.forEach(function (element) {
        expect(typeof element.title).to.be.equal('string');
      });
    });

    it('returns array element objects containing a title property begins with a numeral', function () {
      returnValue.forEach(function (element) {
        expect(!isNaN(element.title.substring(0, 1))).to.be.true;
      });
    });

  });

  it('possesses a getChapterMetadataAtTime() method', function () {
    expect(typeof player.getChapterMetadataAtTime).to.equal('function');
  });

  describe('the getChapterMetadataAtTime() method', function () {
    var testData;

    beforeEach(function () {
      testData = [
        {
          number: 1,
          time: 0,
          title: '1. Chapter the first'
        },
        {
          number: 2,
          time: 33,
          title: '2. Chapter the second'
        },
        {
          number: 3,
          time: 128,
          title: '3. Chapter the third'
        },
      ];
    });

    it('returns empty string if < 2 args supplied', function () {
      expect(player.getChapterMetadataAtTime()).to.equal('');
      expect(player.getChapterMetadataAtTime(1)).to.equal('');
      expect(player.getChapterMetadataAtTime({time: 20, title: 'a title', number: 1})).to.equal('');
    });

    it('returns empty string if < 2 args supplied', function () {
      expect(player.getChapterMetadataAtTime()).to.equal('');
      expect(player.getChapterMetadataAtTime(1)).to.equal('');
      expect(player.getChapterMetadataAtTime({time: 20, title: 'a title', number: 1})).to.equal('');
    });

    it('returns an object with only title and number properties', function () {
      expect(player.getChapterMetadataAtTime(0, testData).title).exists;
      expect(player.getChapterMetadataAtTime(0, testData).number).exists;
      expect(Object.keys(player.getChapterMetadataAtTime(0, testData)).length).to.equal(2);
    });

    it('returns an object with the title property containing the name of the chapter within which the current time sits', function () {
      let expectChapter1Title = player.getChapterMetadataAtTime(0, testData).title;
      expect(expectChapter1Title).to.equal('1. Chapter the first');

      let expectChapter2Title = player.getChapterMetadataAtTime(33, testData).title;
      expect(expectChapter2Title).to.equal('2. Chapter the second');

      let expectChapter3Title = player.getChapterMetadataAtTime(145, testData).title;
      expect(expectChapter3Title).to.equal('3. Chapter the third');
    });

    it('returns an object with the number property containing the number of the chapter within which the current time sits', function () {
      let expectChapter1Number = player.getChapterMetadataAtTime(0, testData).number;
      expect(expectChapter1Number).to.equal(1);

      let expectChapter2Number = player.getChapterMetadataAtTime(33, testData).number;
      expect(expectChapter2Number).to.equal(2);

      let expectChapter3Number = player.getChapterMetadataAtTime(145, testData).number;
      expect(expectChapter3Number).to.equal(3);
    });
  });

  it('possesses a changeChapter method', function () {
    expect(typeof player.changeChapter).to.equal('function');
  });

  describe('the changeChapter() method', function () {
    var testData;

    beforeEach(function () {
      testData = {
        number: 3,
        title: 'I am chapter 3',
        $elmMock: {
          dispatchEvent: spy()
        }
      };
      spy(player, "setTitle");
      player.changeChapter(testData.number, testData.title, testData.$elmMock);

    });

    afterEach(function () {
      player.setTitle.restore();
    });

    it('updates the title with the new chapter title', function () {
      expect(player.setTitle.calledOnce).to.be.true;
      expect(player.setTitle.args[0][1]).to.equal(testData.title);
    });

    it('dispatches a chapterChanged event on the supplied element',
       function () {
         expect(testData.$elmMock.dispatchEvent.calledOnce).to.be.true;
         let args = testData.$elmMock.dispatchEvent.args[0];
         expect(args.length).to.equal(1);
         expect(args[0].type).to.equal('chapterChanged');
       });

    it('the chapterChanged event details the new chapter number',
       function () {
         expect(testData.$elmMock.dispatchEvent.calledOnce).to.be.true;
         // let args = testData.$elmMock.dispatchEvent.args[0];
         expect(testData.$elmMock.dispatchEvent.args[0][0].detail).to.equal(testData.number);
       });

    });

});
