'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class AssetNavigation {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.assetItems = [];

    let promise;

    const $seeAll = this.$elm.querySelector('.asset-viewer-inline__header_link');
    if ($seeAll) {
      promise = utils.remoteDoc($seeAll.href, this.window).then((doc) => {
        const $newAsset = doc.querySelector(`#${this.$elm.id}`);
        const $newSupplements = doc.querySelectorAll(`[data-parent-asset-id="${this.$elm.id}"]`);

        // Avoid circular behaviour.
        let dataset = $newAsset.dataset.behaviour.trim().split(' ');
        const index = dataset.indexOf('AssetNavigation');
        dataset.splice(index, 1);
        $newAsset.dataset.behaviour = dataset.join(' ');

        this.$elm.parentNode.replaceChild($newAsset, this.$elm);
        this.$elm = $newAsset;
        let assetItems = [this.$elm];

        for (const supplement of $newSupplements) {
          assetItems.push(supplement);
          this.$elm.parentNode.insertBefore(supplement, this.$elm.nextSibling);
        }

        return assetItems;
      });
    } else {
      promise = Promise.resolve().then(() => [this.$elm, ...this.findSupplements()]);
    }

    promise = promise.then((assetItems) => {
      this.assetItems = assetItems;
      if (this.assetItems.length > 1) {
        const hash = this.window.location.hash.substring(1);
        let show = 0;
        [].forEach.call(this.assetItems, (assetItem, i) => {
          const navigation = utils.buildElement('div',
            ['asset-viewer-inline__header_navigation'],
            '',
            assetItem.querySelector('.asset-viewer-inline__header_panel'),
            '.asset-viewer-inline__header_text');

          if (assetItem.id === hash) {
            show = i;
          }

          this.addPreviousButton(i, navigation);
          this.addNextButton(i, navigation);

          assetItem.addEventListener('assetViewerFocus', () => this.show(i));
        });

        this.show(show);

        this.window.addEventListener('hashchange', this.hashChange.bind(this));
      }
    });
  }

  addPreviousButton(i, navigation) {
    const previous = utils.buildElement('span', ['asset-viewer-inline__previous'], '', navigation);
    if (i > 0) {
      previous.addEventListener('click', () => {
        this.show(i - 1);
      });
      previous.classList.add('asset-viewer-inline__previous--active');
    }
  }

  addNextButton(i, navigation) {
    const next = utils.buildElement('span', ['asset-viewer-inline__next'], '', navigation);
    if (i < (this.assetItems.length - 1)) {
      next.addEventListener('click', () => {
        this.show(i + 1);
      });
      next.classList.add('asset-viewer-inline__next--active');
    }
  }

  hideAll() {
    [].forEach.call(this.assetItems, (assetItem) => assetItem.classList.add('visuallyhidden'));
  }

  show(i) {
    this.hideAll();
    this.assetItems[i].classList.remove('visuallyhidden');
  }

  findSupplements() {
    return this.doc.querySelectorAll(`[data-parent-asset-id="${this.$elm.id}"]`);
  }

  hashChange(e) {
    let hash = '';

    // event was hashChange
    if (!!e.newURL) {
      hash = e.newURL.substring(e.newURL.indexOf('#') + 1);
    } else {
      hash = this.window.location.hash.substring(1);
    }

    if (!hash) {
      return false;
    }

    [].forEach.call(this.assetItems, (assetItem, i) => {
      if (assetItem.id === hash) {
        this.show(i);
      }
    });
  }

};
