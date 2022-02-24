'use strict';

module.exports = class Modal {
  constructor($elm) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;

    this.setUp();
  }

  setUp() {
    if (!this.supportsClipboard()) {
      this.$elm.remove();
    }

    this.$elm.addEventListener('click', () => {
      this.copyToClipboard(this.$elm.getAttribute('data-clipboard'), () => {
        this.$elm.classList.add('button--success', 'modal-content__clipboard-btn');
        this.$elm.textContent = 'Copied!';
      });
    });
  }

  supportsClipboard() {
    return (navigator.clipboard) ? true : false;
  }

  copyToClipboard(text, onSuccess) {
    navigator.clipboard.writeText(text).then(onSuccess);
  }
};
