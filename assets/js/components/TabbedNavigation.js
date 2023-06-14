'use strict';

const SideBySideView = require('./SideBySideView');

module.exports = class TabbedNavigation {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.$sideBySide = this.$elm.querySelector('.tabbed-navigation__tab-label--side-by-side');

    this.tabElements = this.$elm.querySelectorAll('.tabbed-navigation__tab-label');
    if (this.tabElements.length === 1) {
      this.$elm.classList.add('hidden');
    }

    if (this.sideBySideViewAvailable()) {
      const $header = this.doc.getElementById('siteHeader');
      this.$global = this.doc.querySelector('.global-inner');
      this.sideBySideView = new SideBySideView(
        this.$global,
        this.$sideBySide.dataset.sideBySideLink,
        $header,
        this.window,
        this.doc
      );

      this.openSideBySideListItem();
    }
  }

  sideBySideViewAvailable() {
    if (!this.$sideBySide) {
      return false;
    }

    const link = this.$sideBySide.dataset.sideBySideLink;
    if (!link) {
      return false;
    }

    const isLinkProvided = () => !!(link && link.match(/^https:\/\/.*$/));
    const isSideBySideViewLikelySupported = () => {
      try {
        if (!(this.window.CSS && this.window.CSS.supports)) {
          return false;
        }
      } catch (e) {
        return false;
      }

      // Proxy for IE/Edge, that Lens doesn't support, same as ViewSelector
      return this.window.CSS.supports('text-orientation', 'sideways') ||
             this.window.CSS.supports('-webkit-text-orientation', 'sideways');
    };

    return isLinkProvided() && isSideBySideViewLikelySupported();
  }

  openSideBySideListItem() {
    this.$sideBySide.addEventListener('click', (e) => {
      e.preventDefault();
      this.sideBySideView.open();
    });
  }
};
