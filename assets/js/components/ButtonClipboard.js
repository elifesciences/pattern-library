'use strict';

module.exports = class Modal {
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.$elm.addEventListener('click', () => {
      this.copyToClipboard(this.$elm.getAttribute('data-clipboard'), () => {
        this.$elm.classList.add('button--success', 'modal-content__clipboard-btn');
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
      navigator.clipboard.write([
        new this.window.ClipboardItem({
          'text/html': new Blob([text], { type: 'text/html' }),
        }),
      ]).then(onSuccess).catch(onFail);
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
};
