'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class ArticleDownloadLinksList {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.$elm.classList.add('article-download-links-list--js', 'visuallyhidden');
    this.moveList();
    this.$toggler = this.doc.querySelector('.content-header__download_link');
    this.$toggler.addEventListener('click', this.toggle.bind(this));
  }

  /**
   * Moves the download links list to be by the icon this.$toggler
   */
  moveList() {
    let $newParent = this.doc.querySelector('.content-header_top');
    let $followingSibling =
      $newParent.querySelector('.content-header__download_link').nextElementSibling;
    $newParent.insertBefore(this.$elm, $followingSibling);
  }

  /**
   * Toggles the download links list display.
   *
   * @param e The event triggering the display toggle
   */
  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }

  }

  /**
   * Returns whether links list is currently viewable.
   *
   * @returns {boolean} Whether links list is currently viewable
   */
  isOpen() {
    return !this.$elm.classList.contains('visuallyhidden');
  }

  /**
   * Make viewable.
   */
  open() {
    this.$elm.classList.remove('visuallyhidden');
    this.window.addEventListener('click', this.checkForClose.bind(this));
  }

  /**
   * Checks whether a click occurred outside this, and close this if it did.
   *
   * @param e The click event to evaluate the target of
   */
  checkForClose(e) {
    if (!utils.areElementsNested(this.$elm, e.target)) {
      this.close();
    }
  }

  /**
   * Make unviewable.
   */
  close() {
    this.$elm.classList.add('visuallyhidden');
    this.window.removeEventListener('click', this.checkForClose.bind(this));
  }

};
