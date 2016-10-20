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
    this.$elmYOffset = this.$elm.offsetTop;
    this.cssFixedClassName = 'view-selector--fixed';

    this.$elm.classList.add('view-selector--js');
    this.window.addEventListener('scroll', this.handleScroll.bind(this));

  }

  handleScroll() {
    if (!this.$elm.classList.contains(this.cssFixedClassName)) {
      if (this.window.pageYOffset >= this.$elmYOffset) {
        this.$elm.classList.add(this.cssFixedClassName);
      }
    } else if (this.window.pageYOffset < this.$elmYOffset) {
      this.$elm.classList.remove(this.cssFixedClassName);
    }
    // if we're currently fixed
      // check current Y posn against scrollPosnWhenInitiallyFixed to see if neeed to unfix
  }


};
