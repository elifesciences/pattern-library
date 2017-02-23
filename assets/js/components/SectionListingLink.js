'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class SectionListingLink {

  constructor($elm, _window = window, doc = document) {

    if (!($elm instanceof HTMLElement)) {
      return;
    }

    this.window = _window;
    this.thresholdWidth = 740;
    this.$elm = $elm;
    this.doc = doc;
    this.$list = this.doc.querySelector(SectionListingLink.findIdSelector(this.$elm.href));
    this.$theListParent = this.$list.parentNode;
    this.$theElmParent = $elm.parentNode;
    this.displayBreakpoint();

    this.window.addEventListener('resize',
      utils.debounce(() => this.displayBreakpoint(), 100)
    );

  }

  hideElm() {

    this.$elm.classList.add('visuallyhidden');

  }

  showElm() {

    this.$elm.classList.remove('visuallyhidden');

  }

  displayBreakpoint() {

    if (this.$list && this.viewportNoWiderThan(this.thresholdWidth)) {

      this.switchToMobilePosition();
      this.showElm();

    } else {

      this.switchToDesktopPosition();
      this.hideElm();
    }
  }

  switchToMobilePosition() {


    if (this.isMobile === true) {
      return;
    }

    this.isMobile = true;
    this.$theListParent.appendChild(this.$list);

  }

  switchToDesktopPosition() {

    if (this.isMobile === false) {
      return;
    }

    this.isMobile = false;
    this.$theElmParent.appendChild(this.$list);

  }

  viewportNoWiderThan(thresholdInPx) {
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  static findIdSelector(href) {
    if (href) {
      return href.substring(href.indexOf('#'));
    }
  }

};
