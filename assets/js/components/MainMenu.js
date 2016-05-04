'use strict';

module.exports = class MainMenu {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.$elm.classList.add('main-menu--js');

    this.moveWithinDom();
  }

  /**
   * Moves main menu from default non-js DOM position into position required by js implementation.
   */
  moveWithinDom() {
    let $globalWrapper = this.doc.querySelector('.global-wrapper');
    if (!!$globalWrapper) {
      $globalWrapper.insertBefore(this.$elm, $globalWrapper.firstElementChild);
    }
  }

  /**
   * Indicates whether the main menu is currently open.
   *
   * @returns {boolean} true if the main menu is currently open
   */
  isOpen() {
    return this.$elm.classList.contains('main-menu--shown');
  }

  /**
   * Closes the main menu
   */
  close () {
    this.$elm.classList.remove('main-menu--shown');
    this.doc.querySelector('.global-wrapper').classList.remove('pull-offscreen-right');
  }

  /**
   * Opens the main menu
   */
  open () {
    this.$elm.classList.add('main-menu--shown');
    this.doc.querySelector('.global-wrapper').classList.add('pull-offscreen-right');
  }

};
