'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class SectionListingLink {

  constructor($elm, _window = window, doc = document) {
    try {
      if (!($elm instanceof HTMLElement && $elm.href.length && $elm.href.indexOf('#') > -1)) {
        return;
      }
    } catch (e) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.href = this.$elm.href;
    this.$listing = this.doc.getElementById(this.href.substring(this.href.indexOf('#') + 1));
    if (this.$listing) {
      this.init();
    } else {
      this.$elm.classList.add('hidden');
    }

  }

  init() {
    this.$defaultListParent = this.$listing.parentNode;
    this.$wideViewListParent = this.$elm.parentNode;
    this.breakpoint = 1200;

    this.handleWidth();
    this.window.addEventListener('resize', utils.debounce(() => this.handleWidth(), 10)
    );

  }

  handleWidth() {
    this.updateView(this.$listing, this.$defaultListParent, this.$wideViewListParent, this.breakpoint);
  }

  updateView($list, $defaultListParent, $wideViewListParent, thresholdWidthInPx) {
    if (this.window.matchMedia(`(min-width: ${thresholdWidthInPx}px)`).matches) {
      this.showWideView($list, $wideViewListParent);
    } else {
      this.restoreDefaultView($list, $defaultListParent);
    }
  }

  showWideView($list, $wideViewListParent) {
    if ($list.parentNode !== $wideViewListParent) {
      $wideViewListParent.appendChild($list);
      this.$elm.classList.add('hidden');
    }
  }

  restoreDefaultView($list, $defaultListParent) {
    if ($list.parentNode !== $defaultListParent) {
      $defaultListParent.appendChild($list);
      this.$elm.classList.remove('hidden');
    }
  }

};
