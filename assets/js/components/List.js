'use strict';

module.exports = class List {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    if (!this.$elm || !this.$elm.classList.contains('list--line')) {
      return;
    }

    this.window.addEventListener('load', () => {
      const strongElements = this.$elm.querySelectorAll('strong');
      let maxWidth = 0;

      strongElements.forEach(el => {
        const width = el.offsetWidth;
        if (width > maxWidth) {
          maxWidth = width;
        }
      });

      strongElements.forEach(el => {
        el.style.minWidth = maxWidth + 'px';
      });
    });
  }
};
