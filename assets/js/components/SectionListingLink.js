'use strict';

console.log("a");

module.exports = class SectionListingLink {

  constructor($elm, _window = window, doc = document) {

    if (!($elm instanceof HTMLElement)) {
      return;
    }


    this.window = _window;
    this.thresholdWidth = 600;

    this.doc = doc;
    this.$elm = $elm;
    this.replaceSelfWithTargetFragment();
  }



  // Replace this.$elm with the same-page HTML fragment targeted by this.$elm.href
  replaceSelfWithTargetFragment() {
    console.log("b");

    let $targetFrag = this.doc.querySelector(SectionListingLink.findIdSelector(this.$elm.href));
    if ($targetFrag && !this.viewportNoWiderThan(this.thresholdWidth)) {
      console.log("c");
      this.$elm.parentNode.replaceChild($targetFrag, this.$elm);
    }
  }

  viewportNoWiderThan(thresholdInPx) {
    console.log("d");
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  static findIdSelector(href) {
    if (href) {
      return href.substring(href.indexOf('#'));
    }
  }

};
