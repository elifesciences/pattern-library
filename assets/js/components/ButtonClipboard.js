'use strict';

module.exports = class Modal {
  constructor($elm) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;

    this.$elm.addEventListener('click', () => {
      this.copyToClipboard(this.$elm.getAttribute('data-clipboard'), () => {
        this.$elm.classList.add('button--success', 'button--fixed-width');
        this.$elm.textContent = 'Copied!';
      });
    });
  }

  copyToClipboard(text, onSuccess) {
    navigator.clipboard.writeText(text).then(onSuccess);
  }
};
