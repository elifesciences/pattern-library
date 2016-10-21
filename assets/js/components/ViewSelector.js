'use strict';

module.exports = class ViewSelector {

  constructor($elm, _window = window, doc = document) {

    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.cssFixedClassName = 'view-selector--fixed';
    // matches top padding in scss
    let topSpaceWhenFixed = 30;

    this.$elmYOffset = this.$elm.offsetTop - topSpaceWhenFixed;
    this.window.addEventListener('scroll', this.handleScroll.bind(this));

  }

  handleScroll() {
    if (this.$elm.classList.contains(this.cssFixedClassName)) {
      if (this.window.pageYOffset < this.$elmYOffset) {
        this.$elm.classList.remove(this.cssFixedClassName);
      }
    } else if (this.window.pageYOffset >= this.$elmYOffset) {
      this.$elm.classList.add(this.cssFixedClassName);
    }
  }

};
