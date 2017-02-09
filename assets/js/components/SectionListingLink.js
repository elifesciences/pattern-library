'use strict';

module.exports = class SectionListingLink {

  constructor($trigger, _window = window, doc = document) {

    if (!($trigger instanceof HTMLElement)) {
      return;
    }

    this.window = _window;
    this.thresholdWidth = 740;

    this.doc = doc;

    const $triggerParent = $trigger.parentNode;
    $triggerParent.setAttribute('id', 'section-listing-trigger-parent');

    this.$list = this.doc.querySelector(SectionListingLink.findIdSelector($trigger.href));

    const $listParent = this.$list.parentNode;
    $listParent.setAttribute('id', 'section-listing-list-parent');

    this.displayBreakpoint();
    this.addEvent(window, 'resize', () => this.displayBreakpoint());

  }

  addEvent(object, type, callback) {

    if (object == null || typeof (object) === 'undefined') {
      return;
    }

    if (object.addEventListener) {
      object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
      object.attachEvent('on' + type, callback);
    } else {
      object['on' + type] = callback;
    }

  }

  hideTrigger() {

    const elem = document.querySelector('a.section-listing-link');
    elem.className = 'section-listing-link visuallyhidden';

  }

  showTrigger() {

    const elem = document.querySelector('a.section-listing-link');
    elem.className = 'section-listing-link';

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
