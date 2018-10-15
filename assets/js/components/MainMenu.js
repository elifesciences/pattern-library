'use strict';

const Overlay = require('./Overlay');
const utils = require('../libs/elife-utils')();

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
    this.pageOverlay = new Overlay('body', null, 'overlayMainMenu', 30);
    this.closeFn = this.close.bind(this);
    this.$elm.setAttribute('aria-expanded', 'false');
    this.buildCloseControl();
  }

  /**
   * Moves main menu from default non-js DOM position into position required by js implementation.
   */
  moveWithinDom() {
    this.$elm.classList.add('main-menu--js');
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
    this.$elm.setAttribute('aria-expanded', 'false');
    this.pageOverlay.hide();
    this.pageOverlay.get$elm().removeEventListener('click', this.closeFn);
  }

  /**
   * Opens the main menu
   */
  open () {
    this.$elm.classList.add('main-menu--shown');
    this.$elm.setAttribute('aria-expanded', 'true');
    this.pageOverlay.get$elm().addEventListener('click', this.closeFn);
    this.pageOverlay.show();
  }

  buildCloseControl() {
    let $close;
    if (!this.$elm.querySelector('#mainMenuCloseControl')) {
      const $parent = this.$elm.querySelector('.main-menu__container');
      $close = utils.buildElement('button', ['main-menu__close_control'], 'Close', $parent,
                                  $parent.firstElementChild);
      $close.id = 'mainMenuCloseControl';
      $close.addEventListener('click', this.close.bind(this));
    }
  }

};
