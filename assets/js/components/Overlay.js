'use strict';

const utils = require('../libs/elife-utils')();


/**
 * Creates a new visual overlay of 20% transparent black.
 *
 * Not attachable with a data-behaviour attribute, must be directly invoked by the using component
 * @type {Overlay}
 */
module.exports = class Overlay {

  /**
   *
   * @param $parent the parent element to attach the overlay to
   * @param $followingSibling sibling to attach the overlay before
   * @param id the id to give the overlay
   * @param z the CSS z-index value to give the overlay
   * @param _window window
   * @param doc document
   */
  constructor($parent, $followingSibling, id, z, _window = window, doc = document) {
    this.window = _window;
    this.doc = doc;

    this.$parent = this.find$parent($parent);
    this.$elm = utils.create$pageOverlay(this.$parent, $followingSibling, id);
    if (!this.$elm) {
      return;
    }
    this.assignZIndex(z);
  }

  hide() {
    this.$elm.classList.add('hidden');
  }

  show() {
    this.$elm.style.height = this.$parent.getBoundingClientRect().height + 'px';
    this.$elm.classList.remove('hidden');
  }

  assignZIndex(z) {
    if (!isNaN(z)) {
      if (!this.$elm.style) {
        this.$elm.style = { zIndex: z };
      } else {
        this.$elm.style.zIndex = z;
      }
    }
  }

  find$parent(parentCandidate) {
    if (parentCandidate instanceof HTMLElement) {
      return parentCandidate;
    }
    return this.doc.querySelector(parentCandidate);
  }

  get$elm() {
    return this.$elm;
  }

};
