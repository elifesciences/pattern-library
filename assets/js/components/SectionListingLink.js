'use strict';

module.exports = class SectionListingLink {

  constructor($elm, _window = window, doc = document) {

    if (!($elm instanceof HTMLElement)) {
      return;
    }

    this.doc = doc;
    this.$elm = $elm;
    this.replaceSelfWithTargetFragment();
  }

  // Replace this.$elm with the same-page HTML fragment targeted by this.$elm.href
  replaceSelfWithTargetFragment() {
    let $targetFrag = this.doc.querySelector(SectionListingLink.findIdSelector(this.$elm.href));
    if ($targetFrag) {
      this.$elm.parentNode.replaceChild($targetFrag, this.$elm);
    }
  }

  static findIdSelector(href) {
    if (href) {
      return href.substring(href.indexOf('#'));
    }
  }

};
