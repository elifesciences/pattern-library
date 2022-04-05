'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class Modal {
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.$elm.dataset.resetText = $elm.innerHTML;

    const modal = utils.closest(this.$elm, '.modal');
    if (modal) {
      modal.addEventListener('modalWindowClose', () => {
        this.reset();
      });
    }

    this.$elm.addEventListener('click', () => {
      this.copyToClipboard(this.$elm.getAttribute('data-clipboard'), () => {
        this.$elm.classList.add('button--success');
        this.$elm.textContent = 'Copied!';
      }, () => {
        this.$elm.classList.add('button--fail');
        this.$elm.disabled = true;
        this.$elm.textContent = 'Copy not supported';
      });
    });
  }

  supportsClipboardAPI() {
    return (navigator.clipboard) ? true : false;
  }

  copyToClipboard(text, onSuccess, onFail) {
    if (this.supportsClipboardAPI()) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(onFail);
    } else {
      try {
        this.copyToClipboardFallback(text);
        onSuccess();
      } catch (err) {
        onFail();
      }
    }
  }

  copyToClipboardFallback(text) {
    const textArea = this.doc.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    this.doc.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    this.doc.execCommand('copy');

    this.doc.body.removeChild(textArea);
  }

  reset() {
    this.$elm.classList.remove('button--success', 'button--fail');
    this.$elm.innerHTML = this.$elm.dataset.resetText;
  }
};
