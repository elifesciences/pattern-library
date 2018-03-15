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

  showPlaceholder(selector) {
    const $replacementTarget = this.$elm.querySelector(selector) || this.$elm;
    $replacementTarget.innerHTML = this.placeholder;
    this.$elm.classList.add('speech-bubble--has-placeholder');
  }

  update(content, selector) {
    this.removePlaceholder();
    const $target = this.$elm.querySelector(selector) || this.$elm;
    $target.innerHTML = content;
  }

};
