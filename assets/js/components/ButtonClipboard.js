'use strict';

module.exports = class Modal {
  constructor($elm, _window = window, doc = document, checkSupport = true) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    if (!checkSupport || this.supportsCopy()) {
      this.$elm.addEventListener('click', () => {
        this.copyToClipboard(this.$elm.getAttribute('data-clipboard'), () => {
          this.$elm.classList.add('button--success', 'modal-content__clipboard-btn');
          this.$elm.textContent = 'Copied!';
        });
      });
    } else {
      this.$elm.remove();
    }
  }

  supportsCopy() {
    if (!navigator.clipboard) {
      try {
        this.doc.execCommand('copy');
      } catch (err) {
        return false;
      }
    }

    return true;
  }

  supportsClipboard() {
    return (navigator.clipboard) ? true : false;
  }

  copyToClipboard(text, onSuccess) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(onSuccess);
    } else {
      this.copyToClipboardFallback(text);
      onSuccess();
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
