'use strict';

module.exports = class Modal {
  constructor($elm) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.copyFunction(this.copyToClipboard);

    this.$elm.addEventListener('click', () => {
      this.$copy(this.$elm.getAttribute('data-clipboard'), () => {
        this.$elm.classList.add('button--success', 'button--fixed-width');
        this.$elm.textContent = 'Copied!';
      });
    });
  }

  copyFunction(func) {
    this.$copy = func;
  }

  copyToClipboard(text, onSuccess) {
    navigator.clipboard.writeText(text).then(onSuccess);
  }
};
