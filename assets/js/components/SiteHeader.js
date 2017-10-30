'use strict';

const Overlay = require('./Overlay');
var utils = require('../libs/elife-utils')();

module.exports = class SiteHeader {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    let SearchBox = require('./SearchBox');
    let $searchBoxEl = $elm.querySelector('[data-behaviour="SearchBox"]');
    this.searchBox = new SearchBox($searchBoxEl, this.window, doc);
    var searchToggle = $elm.querySelector('[rel="search"]');
    if (!!searchToggle) {
      this.searchToggle = searchToggle.parentNode;
      this.searchToggle.addEventListener('click', this.toggleSearchBox.bind(this));
    }

    const $overlayParent = this.doc.querySelector('.main');
    if (!$overlayParent) {
      return;
    }

    const $overlayFollowingSibling = $overlayParent.firstElementChild;
    this.pageOverlay = new Overlay($overlayParent, $overlayFollowingSibling, 'mainMenuOverlay', this.window, this.doc);
    this.pageOverlay.assignTop(96);

    // N.B. $mainMenu is not part of this component's HTML hierarchy.
    var mainMenu = doc.querySelector('#mainMenu');
    if (!!mainMenu) {
      let MainMenu = require('./MainMenu');
      this.mainMenu = new MainMenu(mainMenu);

      this.$mainMenuToggle = this.$elm.querySelector('a[href="#mainMenu"]');
      if (!!this.$mainMenuToggle) {
        this.mainMenu.moveWithinDom();
        this.$mainMenuToggle.addEventListener('click', this.toggleMainMenu.bind(this));
      }
    }
  }

  /**
   * Toggles display of the main menu.
   */
  toggleMainMenu(e) {
    if (this.mainMenu.isOpen()) {
      this.mainMenu.close();
      this.window.removeEventListener('keyup', this.checkForMenuClose.bind(this));
      this.doc.querySelector('.global-inner').
               removeEventListener('click', this.checkForMenuClose.bind(this));
    } else {
      this.mainMenu.open();
      this.window.addEventListener('keyup', this.checkForMenuClose.bind(this));
      this.doc.querySelector('.global-inner').
               addEventListener('click', this.checkForMenuClose.bind(this));
    }

    e.preventDefault();
    e.stopPropagation();
  }

  checkForMenuClose(e) {
    if (e.keyCode === 27 || e.type === 'click') {
      this.mainMenu.close();
    }
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
    utils.updateElementTranslate(this.searchBox.$elm, [0, '-40px']);
    if (this.searchBox.$output) {
      this.searchBox.$output.innerHTML = '';
    }

    this.searchBox.$input.blur();
    this.window.removeEventListener('keyup', this.checkForClose.bind(this));
    this.window.removeEventListener('click', this.checkForClose.bind(this));
    this.pageOverlay.hide();
  }

  /**
   * Decides whether to close the search box, based on the supplied event.
   *
   * @param e The KeyboardEvent provoking the check.
   */
  checkForClose(e) {
    if (e.keyCode && e.keyCode === 27 ||
        (e.type === 'click' && !utils.areElementsNested(this.searchBox.$elm, e.target))) {
      this.closeSearchBox();
    }
  }

  /**
   * Opens the search box.
   */
  openSearchBox() {
    let myHeight = this.window.getComputedStyle(this.$elm).height;
    let adjustment = 20;
    let offsetY = utils.adjustPxString(myHeight, adjustment, 'add');

    // This is set in the site-header.scss.
    let transitionDurationInMs = 150;
    utils.updateElementTranslate(this.searchBox.$elm, [0, offsetY]);
    utils.invertPxString(this.window.getComputedStyle(this.searchBox.$container).height);
    this.searchBox.$elm.classList.add('search-box--shown');
    this.window.addEventListener('keyup', this.checkForClose.bind(this));
    this.window.addEventListener('click', this.checkForClose.bind(this));

    this.window.setTimeout(() => {

      // blur before focus forces the focus, a simple focus doesn't always behave as expected.
      this.searchBox.$input.blur();
      this.searchBox.$input.focus();
    }, transitionDurationInMs);
    this.pageOverlay.show();
  }

};
