'use strict';

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.activeClassName = 'tabbed-navigation__tab-label--active';
    this.$tabbedNavigationLinks = Array.prototype.slice.call(this.$elm.querySelectorAll('.tabbed-navigation__tab-label a'));
    this.$tabbedNavigationLinks.forEach((tabbedNavigationLink) => {
      tabbedNavigationLink.addEventListener('click', this.showActiveTab.bind(this));
    });
  }

  showActiveTab(e) {
    e.preventDefault();

    const lastActiveElement = this.$elm.querySelector('.tabbed-navigation__tab-label--active a');

    if (!lastActiveElement || e.target === lastActiveElement) {
      return;
    }

    lastActiveElement.parentNode.classList.remove(this.activeClassName);
    e.target.parentNode.classList.add(this.activeClassName);
  }
};
