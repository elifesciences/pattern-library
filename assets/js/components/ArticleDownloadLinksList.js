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

    // TODO: Remove all conditions for class selector when we use aside component in all pages
    this.$buttonWrapper = this.doc.querySelector('.side-section-wrapper__list') ||
        this.doc.querySelector('.button-collection--inline');

    if (!this.$buttonWrapper) {
      return;
    }

    this.$downloadLink = this.$buttonWrapper.querySelector('.side-section-wrapper__download_link') ||
        this.doc.getElementById('button-action-download');

    if (!this.$downloadLink) {
      return;
    }

    // One statement per class name because IE doesn't support multiple strings, comma separated.
    this.$elm.classList.add('article-download-links-list--js');
    this.$elm.classList.add('visuallyhidden');
    this.$elm.setAttribute('aria-expanded', 'false');
    this.hideJsExcludes();
    this.$toggler = this.doc.querySelector('.side-section-wrapper__download_link') ||
        this.doc.getElementById('button-action-download');

    this.moveList();
    this.$toggler.addEventListener('click', this.toggle.bind(this));
  }

  /**
   * Hide groups marked to exclude in download links list display
   */
  hideJsExcludes() {
    [].forEach.call(this.$elm.querySelectorAll('.article-download-links-list__group--js-exclude'), $group => {
      $group.classList.add('visuallyhidden');
    });
  }

  /**
   * Moves the download links list to be under this.$toggler
   */
  moveList() {
    this.$elm.parentNode.parentNode.classList.add('visuallyhidden');
    this.$toggler.after(this.$elm);
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
    this.$elm.setAttribute('aria-expanded', 'true');
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
    this.$elm.setAttribute('aria-expanded', 'false');
    this.window.removeEventListener('click', this.checkForClose.bind(this));
  }

};
