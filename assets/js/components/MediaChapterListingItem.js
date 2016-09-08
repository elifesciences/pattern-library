'use strict';
module.exports = class MediaChapterListingItem {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      console.warn('No element provided');
      return;
    }

    console.log('Initialising Chapter listing item...');

    this.$elm = $elm;
    this.startTime = $elm.dataset.startTime;
    if (!this.startTime || isNaN(this.startTime) || this.startTime < 0) {
      return;
    }

    this.window = _window;
    this.document = doc;

    // When ready, AudioPlayer dispatches a custom event 'playerReady' on window, that supplies that
    // player's html element id.
    _window.addEventListener('playerReady', this.listenForChapterChange.bind(this));
    this.$link = this.createLink(doc, this.$elm, this.startTime);
    this.setupEventHandlers(this.$link);

  }

  listenForChapterChange (e) {
    let $player = this.document.querySelector('#' + e.detail);
    if (!!$player) {
      $player.addEventListener('chapterChanged', this.indicateChapterChanged.bind(this));
    }
  }

  createLink(document, $rootElm, startTime) {
    let $title = $rootElm.querySelector('.teaser__header_text');
    if (!$title) {
      return;
    }

    let titleText;
    let $existingLink;
    try {
      $existingLink = $title.querySelector('.teaser__header_text_link');
      titleText = $existingLink.innerHTML;
      $existingLink.parentNode.removeChild($existingLink);
    } catch (e) {
      titleText = $title.innerHTML;
    }

    let $link = document.createElement('a');
    $link.innerHTML = titleText;
    $link.setAttribute('href', '#' + startTime);
    $link.classList.add('teaser__header_text_link');
    $title.innerHTML = '';
    $title.appendChild($link);
    return $link;
  }

  indicateChapterChanged(e) {
    let currentChapterNumber = e.detail;
    if (currentChapterNumber === this.window.parseInt(this.$elm.dataset.chapterNumber)) {
      this.$elm.classList.add('current-chapter');
    } else {
      this.$elm.classList.remove('current-chapter');
    }
  }

  setupEventHandlers($link) {
    $link.addEventListener('chapterChanged', this.indicateChapterChanged);
  }

};
