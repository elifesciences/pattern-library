'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class SideBySideView {

  constructor($elm, src, $header, _window = window, doc = document) {

    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$global = $elm;

    this.$header = $header;
    this.eachButHeader = (callback) => {

      [].forEach.call(this.$global.childNodes, (node) => {

        // skip text nodes
        if (!node.tagName) {
          return;
        }

        if (utils.areElementsNested(node, this.$header)) {
          return;
        }

        callback(node);
      });
    };

    this.src = src;
  }

  open() {

    this.saveScrollingPosition();

    this.$iframe = this.doc.querySelector('.side-by-side-view__iframe');
    if (!this.$iframe) {
      this.$iframe = SideBySideView.createIframe(this.src);
      this.doc.body.appendChild(this.$iframe);
    } else {
      this.$iframe.classList.remove('hidden');
    }

    this.$closeBar = this.doc.querySelector('.side-by-side-view__bar');
    if (!this.$closeBar) {
      this.$closeBar = this.createCloseBar();
      this.doc.body.appendChild(this.$closeBar);
    } else {
      this.$closeBar.classList.remove('hidden');
    }

    this.hideEverythingButHeader();
  }

  close() {
    this.$closeBar.classList.add('hidden');
    this.$iframe.classList.add('hidden');
    this.showEverything();
    this.restoreScrollingPosition();
  }

  saveScrollingPosition() {
    this.currentYScrollPos = this.window.pageYOffset;
    this.window.scroll(0, 0);
  }

  restoreScrollingPosition() {
    this.window.scroll(0, this.currentYScrollPos);
    this.currentYScrollPos = null;
  }

  hideEverythingButHeader() {
    this.eachButHeader((element) => {
      element.classList.add('hidden');
    });
  }

  showEverything() {
    this.eachButHeader((element) => {
      element.classList.remove('hidden');
    });
  }

  static createIframe(src) {
    const iframe = utils.buildElement('iframe', ['side-by-side-view__iframe']);
    iframe.src = src;
    return iframe;
  }

  createCloseBar() {
    const div = utils.buildElement('div', ['side-by-side-view__bar']);

    // other X options &#x00D7;&#x2a09;&#x2a2f;
    const btn = utils.buildElement(
      'button',
      ['side-by-side-view__button-close'],
      '<span class="side-by-side-view__button-close-cross">&#x2715;</span>' +
      '<span class="side-by-side-view__button-close-text">Close side by side view</span>',
      div
    );
    btn.addEventListener('click', () => {
      this.close();
    });
    return div;
  }
};
