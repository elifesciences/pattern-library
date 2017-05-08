'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class Overlay {

  constructor($parent, $followingSibling, id, z, _window = window, doc = document) {
    this.window = _window;
    this.doc = doc;

    this.$parent = this.find$parent($parent);
    this.$elm = utils.createPageOverlay(this.$parent, $followingSibling, id);
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
