'use strict';

module.exports = class SpeechBubble {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.placeholder = '“';
  }

  removePlaceholder() {
    this.$elm.classList.remove('speech-bubble--has-placeholder');
    const re = new RegExp(this.placeholder, 'g');
    this.$elm.innerHTML = this.$elm.innerHTML.replace(re, '');
  }

  showPlaceholder(replacementTargetSelector) {
    // const $replacementTarget = this.$elm.querySelector(replacementTargetSelector) ||
    //                            this.$elm.parentNode.querySelector(replacementTargetSelector) ||
    //                            this.$elm;
    const $replacementTarget = this.$elm.querySelector(replacementTargetSelector) || this.$elm;
    $replacementTarget.innerHTML = this.placeholder;
    this.$elm.classList.add('speech-bubble--has-placeholder');
  }

  static findElement(selector, $root) {
    const $child = $root.querySelector(selector);
    if ($child) {
      return $child;
    }

    if ($root === $root.parentNode.querySelector(selector)) {
      return $root;
    }

  }

};
