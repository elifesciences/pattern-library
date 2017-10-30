let chai = require('chai');
let expect = chai.expect;

describe('A Podcast page', function() {
  it('should have the right title', function () {
    browser.url('/patterns/04-pages-podcast/04-pages-podcast.html');
  });

  it('should load offset and duration', function () {
    var currentTime = browser.getText('.audio-player__current_time');
    expect(currentTime).to.equal('0:00');
    browser.waitUntil(function () {
      var duration = browser.getText('.audio-player__duration');
      return duration === '28:05';
    }, 5000, 'expected duration to load after 5s');
  });

  it('should play', function() {
    // not working inside a VM yet
  });
});
