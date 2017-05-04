'use strict';

module.exports = class SideBySideView {

  constructor($elm, src, _window = window, doc = document) {

    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$global = $elm;

    // TODO: inject 'header'
    this.$header = this.$global.querySelector('header');
    this.eachButHeader = (callback) => {

      // NodeList doesn't have forEach in this testing environment...
      for (var i = 0; i < this.$global.childNodes.length; i += 1) {
        var node = this.$global.childNodes[i];

        // skip text nodes
        if (!node.tagName) {
          continue;
        }

        if (node === this.$header) {
          continue;
        }

        callback(node);
      }
    };

    this.src = src;
  }

  open() {

    this._saveScrollingPosition();

    this.$iframe = this.doc.querySelector('.side-by-side-view__iframe');
    if (!this.$iframe) {
      this.$iframe = this._createIframe(this.src);
      this.doc.querySelector('body').appendChild(this.$iframe);
    } else {
      this.$iframe.classList.remove('hidden');
    }

    this.$closeButton = this.doc.querySelector('.side-by-side-view__button--close');
    if (!this.$closeButton) {
      this.$closeButton = this._createCloseButton();
      this.$closeButton.addEventListener('click', () => {
        this.close();
      });
      this.$header.appendChild(this.$closeButton);
    } else {
      this.$closeButton.classList.remove('hidden');
    }

    this._hideEverythingButHeader();
  }

  close() {
    this.$closeButton.classList.add('hidden');
    this.$iframe.classList.add('hidden');
    this._showEverything();
    this._restoreScrollingPosition();
  }

  _saveScrollingPosition() {
    this.currentYScrollPos = this.window.pageYOffset;
    window.scroll(0, 0);
  }

  _restoreScrollingPosition() {
    window.scroll(0, this.currentYScrollPos);
    this.currentYScrollPos = null;
  }

  _hideEverythingButHeader() {
    this.eachButHeader((node) => {
      node.classList.add('hidden');
    });
  }

  _showEverything() {
    this.eachButHeader((node) => {
      node.classList.remove('hidden');
    });
  }

  _createIframe(src) {
    var iframe = this.doc.createElement('iframe');
    iframe.src = src;
    iframe.classList.add('side-by-side-view__iframe');
    return iframe;
  }

  _createCloseButton() {
    var btn = this.doc.createElement('button');
    btn.innerHTML = '<span class="side-by-side-view__button-close-cross">&00D7;&2715;&2a09;&2a2f;</span> Close side by side view';
    btn.classList.add('side-by-side-view__button-close');
    return btn;
  }
};
