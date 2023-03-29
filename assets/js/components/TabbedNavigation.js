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

    if (!lastActiveElement || e.target.classList.contains('tabbed-navigation__tabs')) {
      return;
    }

    lastActiveElement.classList.remove(this.activeClassName);

    if (e.target.classList.contains('tabbed-navigation__tab-label')) {
      e.target.classList.add(this.activeClassName);
    } else if (e.target.classList.contains('tabbed-navigation__tab-label--long')) {
      e.target.parentNode.parentNode.classList.add(this.activeClassName);
    } else {
      e.target.parentNode.classList.add(this.activeClassName);
    }

    e.preventDefault();
    e.stopPropagation();
  }
};
