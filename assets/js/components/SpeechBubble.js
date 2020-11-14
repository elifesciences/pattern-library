'use strict';

module.exports = class SpeechBubble {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.placeholder = '+';
  }

  removePlaceholder() {
    this.$elm.classList.remove('speech-bubble--has-placeholder');
    const pattern = '\\' + this.placeholder;
    const re = new RegExp(pattern, 'g');
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

  showLoadingIndicator() {
    this.$elm.classList.add('speech-bubble--loading');
  }

  removeLoadingIndicator() {
    this.$elm.classList.remove('speech-bubble--loading');
  }

  showFailureState(applyToParent) {
    if (applyToParent) {
      this.$elm.parentNode.parentNode.removeChild(this.$elm.parentNode);
    } else {
      this.$elm.parentNode.removeChild(this.$elm);
    }
  }

};
