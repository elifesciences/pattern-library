'use strict';
var utils = require('../libs/elife-utils')();
module.exports = class AudioPlayer {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      console.warn('No element provided');
      return;
    }

    this.window = _window;
    if (!this.window.HTMLAudioElement) {
      console.warn('Audio element not supported');
      return;
    }

    console.log('Initialising Audio Player...');

    this.$elm = $elm;
    this.$audioElement = this.$elm.querySelector('audio');
    if (!this.$audioElement) {
      console.warn('No audio element found');
      return;
    }

    this.uniqueId = utils.uniqueIds.get('audio', doc);
    this.$elm.id = this.uniqueId;
    this.$playButton = AudioPlayer.buildPlayButton(this);
    this.$icon = this.$playButton.querySelector('.audio-player__toggle_play_icon');

    // $title must be prepared before buildProgressIndicator is called
    this.$title = this.prepare$title(this.$elm.querySelector('.audio-player__header'), doc);
    this.$progressTrack = AudioPlayer.buildProgressIndicator(this);
    this.$progressBar = this.$progressTrack.querySelector('[class*="progress_bar"]');
    this.$timeIndicators = AudioPlayer.buildTimeIndicators(this);
    this.$currentTime = this.$timeIndicators.querySelector('[class*="current_time"]');
    this.$duration = this.$timeIndicators.querySelector('[class*="duration"]');

    // state
    this.duration = null;
    this.isPlaying = false;

    // setup
    this.$elm.classList.add('audio-player--js');
    this.usingMetadata = false;  // set to true in loadMetadata if no errors thrown
    this.loadMetadata(this.$elm.dataset.episodeNumber);

    // events
    this.$playButton.addEventListener('click', () => {
      this.togglePlay(this.$audioElement, this.$playButton);
    }, false);
    this.$audioElement.addEventListener('loadedmetadata', () => {
      this.duration = this.$audioElement.duration;
      this.$duration.innerHTML = AudioPlayer.secondsToMinutes(this.duration);
    });
    this.$audioElement.addEventListener('timeupdate', this.update.bind(this));
    this.window.addEventListener('load', this.seekNewTime.bind(this));
    this.window.addEventListener('hashchange', this.seekNewTime.bind(this));
  }

  prepare$title(parent, doc) {
    let span = doc.createElement('span');
    try {
      span.innerHTML = parent.innerHTML;
    } catch (e) {
      return;
    }

    span.classList.add('audio-player__title');
    parent.innerHTML = '';
    parent.appendChild(span);
    return span;
  }

  /**
   * Converts seconds to a display of minutes & seconds.
   *
   * @param {Number} seconds The time to convert, in seconds
   * @returns {string} The time in a [m]m:ss string
   */
  static secondsToMinutes(seconds) {
    let _seconds = parseInt(seconds, 10);
    let mins = Math.floor(_seconds / 60);
    let secs = _seconds % 60;
    if (secs <= 9) {
      secs = '0' + secs;
    }

    return `${mins}:${secs}`;
  }

  //noinspection JSValidateJSDoc
  /**
   * Toggles play/pause state of media file.
   *
   * @param {HTMLAudioElement} $audioElement The audio element to toggle the play state of
   * @param {HTMLButtonElement} $togglePlayButton The button controlling the playback
   */
  togglePlay($audioElement, $togglePlayButton) {
    if (this.isPlaying) {
      this.pause($audioElement, $togglePlayButton);
    } else {
      this.play($audioElement, $togglePlayButton);
    }
  }

  play($audioElement, $togglePlayButton) {
    $audioElement.play();
    AudioPlayer.updateIconState(this.$icon, 'pause');
    $togglePlayButton.classList.add('audio-player__toggle_play--pauseable');
    $togglePlayButton.classList.remove('audio-player__toggle_play--playable');
    this.isPlaying = true;
  }

  pause ($audioElement, $togglePlayButton) {
    $audioElement.pause();
    AudioPlayer.updateIconState(this.$icon, 'play');
    $togglePlayButton.classList.add('audio-player__toggle_play--playable');
    $togglePlayButton.classList.remove('audio-player__toggle_play--pauseable');
    this.isPlaying = false;
  }

  /**
   * Update the progress bar and elapsed time indicator based on track's current time.
   */
  update() {
    let currentTime = Math.floor(this.$audioElement.currentTime);
    let pc = (currentTime / this.duration) * 100;
    let currentTime2Dis = AudioPlayer.secondsToMinutes(currentTime);
    this.$progressBar.style.width = `${pc}%`;
    this.$currentTime.innerHTML = currentTime2Dis;

    if (this.usingMetadata) {
      let chapterNumberOnLastUpdate = this.getCurrentChapterNumber();
      this.setCurrentChapterMetadata(this.getChapterMetadataAtTime(currentTime,
                                                                   this.chapterMetadata));
      if (this.getCurrentChapterMetadata().number !== chapterNumberOnLastUpdate) {
        this.changeChapter(this.getCurrentChapterNumber(),
                           this.getCurrentChapterMetadata().title,
                           this.$elm);
      }
    }

    if (this.$audioElement.ended) {
      AudioPlayer.updateIconState(this.$icon, 'play');
      this.isPlaying = false;
    }
  }

  /**
   * Updates player title with chapter number & name, and dispatches chapterChanged event.
   *
   * @param {int} number New chapter number Used as value of detail property of
   * @param {String} title new chapter title
   * @param {HTMLElement} $elm Element from which to dispatch the event
   */
  changeChapter(number, title, $elm) {
    this.setTitle(this.episodeTitle, title);
    let chapterChanged;
    try {
      chapterChanged = new CustomEvent('chapterChanged', { detail: number });
    } catch (e) {
      // CustomEvent not supported, do it the old fashioned way
      chapterChanged = document.createEvent('chapterChanged');
      chapterChanged.initCustomEvent('chapterChanged', true, true, { detail: number });
    }

    $elm.dispatchEvent(chapterChanged);
  }

  /**
   * Updates the icon state for the play button.
   *
   * @param $icon {HTMLImageElement} The img to update
   * @param state {string} The state to update to (either 'play' or 'pause')
   */
  static updateIconState($icon, state) {
    if (state !== 'play' && state !== 'pause') {

      return;
    }

    $icon.src = AudioPlayer.getIconPath((state));
    $icon.alt = state;
  }

  seekNewTime(e) {
    var hash;
    var shouldPlay = false;
    try {
      hash = e.newURL.substring(e.newURL.indexOf('#') + 1);

      // Should play when chapter changed within the page, but not autoplay on page load :-)
      shouldPlay = true;
    } catch (e) {
      // newURL only available on hashchange event, but load event may also invoke this handler
      hash = this.window.location.hash.substring(1);
      shouldPlay = false;
    }

    if (!isNaN(hash) && hash >= 0) {
      this.seek(hash, this.$audioElement);
      if (!this.isPlaying && shouldPlay) {
        this.play(this.$audioElement, this.$playButton);
      }
    }
  }

  /**
   * Event handler to determine track seek time in response to user interaction.
   *
   * @param e The user-generated click event
   * @param {AudioPlayer} player The audio player object that the new element belongs to
   */
  handleSeek(e, player) {
    var newSeekPosition = parseInt(e.offsetX, 10);
    var availableWidth = player.$progressTrack.clientWidth;
    var durationProportionToSeek = (newSeekPosition / parseInt(availableWidth, 10));
    this.seek(durationProportionToSeek * player.duration, player.$audioElement);
  }

  //noinspection JSValidateJSDoc
  /**
   * Seeks a particular time in the media file.
   *
   * @param {Number} time The time to seek
   * @param {HTMLAudioElement} $audioElement The audio element to toggle the play state of
   */
  seek(time, $audioElement) {
    $audioElement.currentTime = time;
    this.update();
  }

  /**
   * Builds the progress indicator.
   *
   * @param {AudioPlayer} player The audio player object that the new element belongs to
   * @returns {Element} The progress indicator
   */
  static buildProgressIndicator(player) {
    var $barWrapper = utils.buildElement('div',
                               ['audio-player__progress'],
                               '',
                               '#' + player.uniqueId + ' [class*="audio-player__container"]');

    utils.buildElement('div', ['audio-player__progress_bar'], '', $barWrapper);

    $barWrapper.addEventListener('click', function (e) {
      player.handleSeek(e, player);
    }, false);

    return $barWrapper;
  }

  /**
   * Builds the play button.
   *
   * @param {AudioPlayer} player The audio player object that the new element belongs to
   * @returns {Element} The play/pause button
   */
  static buildPlayButton(player) {
    var $button = utils.buildElement('button',
                              ['audio-player__toggle_play'],
                              '',
                              '#' + player.uniqueId + ' [class*="audio-player"]',
                              true);
    var $image = utils.buildElement('img',
                       ['audio-player__toggle_play_icon'],
                       '',
                       $button);
    $image.src = AudioPlayer.getIconPath('play');
    $image.alt = 'Play';
    return $button;
  }

  /**
   * Builds the current time and duration indicators.
   *
   * @param {AudioPlayer} player The audio player object that the new element belongs to
   * @returns {Element} An element containing the current time and duration indicators.
   */
  static buildTimeIndicators(player) {
    var playerId = player.uniqueId;
    var $container = utils.buildElement('div',
                                        ['audio-player__times'],
                                        '',
                                        '#' + playerId + ' [class*=audio-player__header]',
                                        true);

    utils.buildElement('span', ['audio-player__current_time'], '0:00', $container);
    utils.buildElement('span', ['audio-player__duration'], '0:00', $container);
    return $container;
  }

  static getIconPath(iconName) {

    if (iconName !== 'play' && iconName !== 'pause') {
      return;
    }

    return `../../assets/img/icons/audio-${iconName}.svg`;
  }

  /**
   * Set the title based on both episode and chapter titles
   * @param episodeTitle
   * @param chapterTitle
   */
  setTitle(episodeTitle, chapterTitle) {
    this.title = episodeTitle;
    if (!!chapterTitle) {
      this.title += ': ' + chapterTitle;
    }

    this.$title.innerHTML = this.title;
  }

  getCurrentChapterMetadata() {
    return this.currentChapterMetadata;
  }

  setCurrentChapterMetadata(metadata) {
    this.currentChapterMetadata = metadata;
  }

  getCurrentChapterNumber() {
    return this.getCurrentChapterMetadata().number || 0;
  }

  /**
   * Returns a chapter's title and number, based on the playback position
   * @param time
   * @param {Array} chapterMetadata
   * An array of objects that must contain as a minimum
   * @returns {*}
   */
  getChapterMetadataAtTime(time, chapterMetadata) {
    if (!chapterMetadata) {
      return '';
    }

    let chapterTitle = '';
    let chapterNumber = 0;
    chapterMetadata.forEach(function (chapter, i, chapters) {
      let chapterStartTime = parseInt(chapter.time, 10);
      let nextChapterStartTime = i < chapters.length - 1 ? chapters[i + 1].time : null;
      if (time >= chapterStartTime) {
        if (!nextChapterStartTime || time < nextChapterStartTime) {
          chapterTitle = chapter.title;
          chapterNumber = chapter.number;
        }
      }
    });

    return {
      title: chapterTitle,
      number: chapterNumber
    };
  }

  /**
   * Sets episode title and respective chapter information from metadata
   * @param metadata
   */
  processMetadata(metadata) {
    this.episodeTitle = 'Episode ' + metadata.number;
    this.setTitle(this.episodeTitle);

    this.chapterMetadata = this.prepareChapterMetadata(metadata);
    this.currentChapterMetadata = { number: 0, title: '' };
  }

  /**
   * Returns array of objects describing respective chapter information
   * @param metadata
   * @returns {Array} of objects containing time, number and title properties
   */
  prepareChapterMetadata(metadata) {
    let chapterMetadata = [];
    metadata.chapters.forEach((chapter) => {
      chapterMetadata.push(
        {
          time: chapter.time,
          number: chapter.number,
          title: chapter.number + '. ' + chapter.title
        }
      );
    });

    return chapterMetadata;
  }

  /**
   * Metadata is expected in the data-metadata attribute of $elm as a JSON-like string with single-
   * quoted instead of double-quoted values.
   */
  loadMetadata() {
    try {
      this.processMetadata(JSON.parse(this.$elm.dataset.metadata.replace(/'/g, '"')));
      this.usingMetadata = true;
    } catch (e) {
      console.error(e);
      this.usingMetadata = false;
    }
  }
};
