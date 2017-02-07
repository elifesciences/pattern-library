'use strict';

module.exports = class SectionListingLink {

  insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }

  constructor($trigger, _window = window, doc = document) {

    if (!($trigger instanceof HTMLElement)) {
      return;
    }


    this.window = _window;
    this.thresholdWidth = 740;

    this.doc = doc;

    this.$trigger = $trigger;
    this.$triggerParent = this.$trigger.parentNode;
    this.$triggerParent.setAttribute("id", "section-listing-trigger-parent");

    this.$list = this.doc.querySelector(SectionListingLink.findIdSelector(this.$trigger.href));
    this.$listParent = this.$list.parentNode;
    this.$listParent.setAttribute("id", "section-listing-list-parent");

    this.displayBreakpoint();
    this.addEvent(window, "resize", () => this.displayBreakpoint());


  }

  //
  addEvent(object, type, callback) {

    if (object == null || typeof(object) == 'undefined') return;

    if (object.addEventListener) {
      object.addEventListener(type, callback, false);
    } else if (object.attachEvent) {
      object.attachEvent("on" + type, callback);
    } else {
      object["on"+type] = callback;
    }

  }

  hideTrigger() {

    let elem = document.querySelector("a.section-listing-link");
    elem.className = "section-listing-link visuallyhidden";

  }
  showTrigger() {

    let elem = document.querySelector("a.section-listing-link");
    elem.className = "section-listing-link";

  }

  //
  displayBreakpoint() {

    if(this.$list && this.viewportNoWiderThan(this.thresholdWidth)){

      this.isMobile();
      this.showTrigger();

    } else {

      this.isDesktop();
      this.hideTrigger();
    }
  }

  //
  isMobile(){

    let theListParent = document.getElementById("section-listing-list-parent");
    let theLast = document.getElementById("subjectsListing");

    theListParent.appendChild(theLast);

  }

  //
  isDesktop(){

    let theTriggerParent = document.getElementById("section-listing-trigger-parent");
    let theFirst = document.getElementById("subjectsListing");

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
