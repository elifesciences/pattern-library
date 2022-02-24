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
      });
    });
  }

  supportsClipboard() {
    return (navigator.clipboard) ? true : false;
  }

  copyToClipboard(text, onSuccess) {
    if (this.supportsClipboard()) {
      navigator.clipboard.writeText(text).then(onSuccess);
    } else {
      this.copyToClipboardFallback(text, onSuccess);
    }
  }

  copyToClipboardFallback(text, onSuccess) {
    const textArea = this.doc.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    this.doc.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      this.doc.execCommand('copy');
      onSuccess();
    } catch (err) {
      this.$elm.remove();
    }

    this.doc.body.removeChild(textArea);
  }
};
