'use strict';

module.exports = class TabbedNavigation {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.tabElements = this.$elm.querySelectorAll('.tabbed-navigation__tab-label');
    if (this.tabElements.length === 1) {
      this.$elm.classList.add('hidden');
    }
  }
};
