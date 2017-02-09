'use strict';

module.exports = class SectionListingLink {

  constructor($elm, _window = window, doc = document) {

    if (!($elm instanceof HTMLElement)) {
      return;
    }

    this.window = _window;
    this.thresholdWidth = 740;

    this.doc = doc;

    const $elmParent = $elm.parentNode;
    $elmParent.setAttribute('id', 'section-listing-trigger-parent');

    this.$list = this.doc.querySelector(SectionListingLink.findIdSelector($elm.href));

    const $listParent = this.$list.parentNode;
    $listParent.setAttribute('id', 'section-listing-list-parent');

    this.displayBreakpoint();
    window.addEventListener('resize', () => this.displayBreakpoint());

  }

  hideTrigger() {

    //console.log("hidethis", $elm);

    const elem = document.querySelector('a.section-listing-link');
    elem.classList.add('visuallyhidden');

  }

  showTrigger() {

    //console.log("showthis", $elm);

    const elem = document.querySelector('a.section-listing-link');
    elem.classList.remove('visuallyhidden');

  }

  displayBreakpoint() {

    if (this.$list && this.viewportNoWiderThan(this.thresholdWidth)) {

      this.isMobile();
      this.showTrigger();

    } else {

      this.isDesktop();
      this.hideTrigger();
    }
  }

  isMobile() {

    const theListParent = document.getElementById('section-listing-list-parent');
    const theLast = document.getElementById('sectionsListing');

    theListParent.appendChild(theLast);

  }

  isDesktop() {

    const theTriggerParent = document.getElementById('section-listing-trigger-parent');
    const theFirst = document.getElementById('sectionsListing');

    theTriggerParent.appendChild(theFirst);

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
