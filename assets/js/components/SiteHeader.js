'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class SiteHeader {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    let SearchBox = require('./SearchBox');
    let $searchBoxEl = $elm.querySelector('[data-behaviour="SearchBox"]');
    this.searchBox = new SearchBox($searchBoxEl, this.window, doc);
    this.searchToggle = $elm.querySelector('[rel="search"]').parentNode;
    this.searchToggle.addEventListener('click', this.toggleSearchBox.bind(this));
    this.$elm = $elm;
    this.window = _window;
  }

  /**
   * Toggles display of the search box.
   *
   * @param {Event} e The event causing the toggle to occur
   */
  toggleSearchBox(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.searchBoxIsOpen()) {
      this.closeSearchBox();
    } else {
      this.openSearchBox();
    }
  }

  /**
   * Returns true if the search box is currently displayed.
   *
   * @returns {boolean} True if the search box is open
   */
  searchBoxIsOpen() {
    return this.searchBox.$elm.classList.contains('search-box--shown');
  }

  /**
   * Closes the search box.
   */
  closeSearchBox() {
    this.searchBox.$elm.classList.remove('search-box--shown');
    this.searchBox.$elm.style.transform = '';
    if (this.searchBox.$output) {
      this.searchBox.$output.innerHTML = '';
    }

    this.searchBox.$input.blur();
    this.window.removeEventListener('keyup', this.checkForClose.bind(this));
  }

  /**
   * Checks whether the search box should be closed.
   *
   * @param e The KeyboardEvent provoking the check.
   */
  checkForClose(e) {
    if (e.keyCode && e.keyCode === 27) {
      this.closeSearchBox();
    }
  }

  /**
   * Opens the search box.
   */
  openSearchBox() {
    let offsetY = this.window.getComputedStyle(this.$elm).height;

    // This is set in the site-header.scss.
    let transitionDurationInMs = 150;
    utils.updateElementTranslate(this.searchBox.$elm, [0, offsetY]);

    // blur before focus forces the focus, a simple focus doesn't always behave as expected.
    this.searchBox.setOutputTopPosn(this.window.getComputedStyle(this.searchBox.$container).height);
    this.searchBox.$elm.classList.add('search-box--shown');
    this.window.addEventListener('keyup', this.checkForClose.bind(this));
    this.window.setTimeout(() => {
      this.searchBox.$input.blur();
      this.searchBox.$input.focus();
    }, transitionDurationInMs);
  }
};
