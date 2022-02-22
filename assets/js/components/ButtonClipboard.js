'use strict';

module.exports = class Modal {
  constructor($elm) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;

    this.$elm.addEventListener('click', () => {
      navigator.clipboard.writeText(this.$elm.getAttribute('data-clipboard')).then(() => {
        this.$elm.classList.add('button--success', 'button--fixed-width');
        this.$elm.textContent = 'Copied!';
      });
    });
  }
};
