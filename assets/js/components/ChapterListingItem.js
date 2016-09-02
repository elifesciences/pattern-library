'use strict';
module.exports = class ChapterListingItem {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
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
    this.createLink(doc, this.$elm, this.startTime);
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
    // $title.parentNode.replaceChild($link, $title);
  }

  createLinkHandler(document, $link) {

  }
};
