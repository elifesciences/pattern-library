'use strict';

module.exports = class ViewSelector {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    _window.console.log('$elm is ' + $elm);
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.cssFixedClassName = 'view-selector--fixed';
    this.$elm.classList.add('view-selector--js');
    this.scrollPosnWhenInitiallyFixed;
    this.window.addEventListener('scroll', this.handleScroll.bind(this));

  }

  handleScroll() {
    this.window.console.log('this.$elm.offsetTop', this.$elm.offsetTop);
    // if we're not already fixed
    if (!this.$elm.classList.contains(this.cssFixedClassName)) {
      // check if we're at (or off) the top of the screen and if so:

      //   1. if scrollPosnWhenInitiallyFixed no set, record current Y position in scrollPosnWhenInitiallyFixed
      //   2. fix
    }
    // if we're currently fixed
      // check current Y posn against scrollPosnWhenInitiallyFixed to see if neeed to unfix
  }

};
