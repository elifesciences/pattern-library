'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class AssetViewer {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.assetItems = [this.$elm];
    this.assetItems.push(...this.findSupplements());

    if (this.assetItems.length > 1) {
      let text = `with ${this.assetItems.length} supplement`;
      if (this.assetItems.length > 2) {
        text += 's';
      }

      this.$elm.querySelector('.asset-viewer-inline__header_text').appendChild(doc.createTextNode(text));

      let i;
      for (i = 0; i < this.assetItems.length; i++) {
        const assetItem = this.assetItems[i];
        const x = i;
        const navigation = doc.createElement('span');
        navigation.classList.add('asset-viewer-inline__header_navigation');

        const previous = doc.createElement('span');
        previous.classList.add('asset-viewer-inline__previous');
        if (i > 0) {
          previous.addEventListener('click', () => {
            this.show(x - 1);
          });
          previous.classList.add('asset-viewer-inline__previous--active');
        }
        navigation.appendChild(previous);

        const next = doc.createElement('span');
        next.classList.add('asset-viewer-inline__next');
        if (i < (this.assetItems.length - 1)) {
          next.addEventListener('click', () => {
            this.show(x + 1);
          });
          next.classList.add('asset-viewer-inline__next--active');
        }
        navigation.appendChild(next);

        assetItem.querySelector('.asset-viewer-inline__header_panel').insertBefore(navigation, assetItem.querySelector('.asset-viewer-inline__header_text'));
      }

      this.show(0);
    }
  }

  hideAll() {
    let i;
    for (i = 0; i < this.assetItems.length; i++) {
      this.assetItems[i].classList.add('visuallyhidden');
    }
  }

  show(i) {
    this.hideAll();
    this.assetItems[i].classList.remove('visuallyhidden');
  }

  findSupplements() {
    return this.doc.querySelectorAll(`[data-parent-asset-id="${this.$elm.id}"]`);
  }

};
