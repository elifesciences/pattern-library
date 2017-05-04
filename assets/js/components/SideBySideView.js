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
      for (var i = 0; i < this.$global.childNodes.length; i++) {
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

    this.sideBySideSrc = src;
  }

  openSideBySideView() {

    this._saveScrollingPosition();

    this.$sideBySideView = this.doc.querySelector('.side-by-side-view');
    if (!this.$sideBySideView) {
      this.$sideBySideView = this._createSideBySideView(this.sideBySideSrc);
      this.doc.querySelector('body').appendChild(this.$sideBySideView);
    } else {
      this.$sideBySideView.classList.remove('hidden');
    }

    this.$sideBySideCloseButton = this.doc.querySelector('.close-side-by-side-view');
    if (!this.$sideBySideCloseButton) {
      this.$sideBySideCloseButton = this._createSideBySideCloseButton();
      this.$sideBySideCloseButton.addEventListener('click', (e) => {
        this.closeSideBySideView();
      });
      this.$header.appendChild(this.$sideBySideCloseButton);
    } else {
      this.$sideBySideCloseButton.classList.remove('hidden');
    }

    this._hideEverythingButHeader();
  }

  closeSideBySideView() {
    this.$sideBySideCloseButton.classList.add('hidden');
    this.$sideBySideView.classList.add('hidden');
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

  _createSideBySideView(src) {
    var iFrame = this.doc.createElement('iframe');
    iFrame.src = src;
    iFrame.classList.add('side-by-side-view');
    return iFrame;
  }

  _createSideBySideCloseButton() {
    var btn = this.doc.createElement('button');
    btn.innerHTML = 'Close side-by-side view';
    btn.classList.add('close-side-by-side-view');
    return btn;
  };
};
