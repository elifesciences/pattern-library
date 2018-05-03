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

  showLoadingIndicator() {
    this.$elm.classList.add('speech-bubble--loading');
  }

  removeLoadingIndicator() {
    this.$elm.classList.remove('speech-bubble--loading');
  }

  showFailureState(applyToParent) {
    this.removeLoadingIndicator();
    this.$elm.setAttribute('disabled', 'disabled');
    this.$elm.style.cursor = 'not-allowed';

    if (applyToParent) {
      this.$elm.parentElement.style.cursor = 'not-allowed';
      this.$elm.parentElement.style.color = '#888'; // $color-text-secondary

      if (this.$elm.previousElementSibling) {
        this.$elm.previousElementSibling.style.cursor = 'not-allowed';
        this.$elm.previousElementSibling.style.color = '#888'; // $color-text-secondary
      }

    }
  }

};
