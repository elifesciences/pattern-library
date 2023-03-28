'use strict';

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.activeClassName = 'tabbed-navigation__tab-label--active';
    this.$tabbedNavigation = this.$elm.querySelector('.tabbed-navigation__tabs');
    this.$tabbedNavigation.addEventListener('click', this.showActiveTab.bind(this));
  }

  showActiveTab(e) {
    const lastActiveElement = this.$elm.querySelector('.' + this.activeClassName);

    if (!lastActiveElement) {
      return;
    }

    if (e.target.classList.contains('tabbed-navigation__tab-label--long')) {
      lastActiveElement.classList.remove(this.activeClassName);
      e.target.parentNode.parentNode.classList.add(this.activeClassName);
    } else {
      lastActiveElement.classList.remove(this.activeClassName);
      e.target.parentNode.classList.add(this.activeClassName);
    }

    e.preventDefault();
    e.stopPropagation();
  }
};
