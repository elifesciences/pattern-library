'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class AnnotationTeaser {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.createLink(this.$elm.dataset.inContextUri);
    if (this.$elm.dataset.isReply) {
      this.showAsReply('View the full conversation');
    }

  }

  createLink(uri) {
    if (!uri || typeof uri !== 'string') {
      return;
    }

    const $a = utils.buildElement('a', ['annotation-teaser__link']);
    const rootChildren = [].slice.call(this.$elm.childNodes);
    [].forEach.call(rootChildren, (node) => {
      $a.appendChild(node);
    });

    $a.setAttribute('href', uri);
    this.$elm.appendChild($a);
  }

  showAsReply(text) {
    if (!text || typeof text !== 'string') {
      return;
    }

    const $parent = this.$elm.querySelector('.annotation-teaser__reply');
    utils.buildElement('span', ['annotation-teaser__reply_cta'], text, $parent);
  }

};
