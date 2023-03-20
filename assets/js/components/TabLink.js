'use strict';

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.activeClassName = 'tab-link__active';
    this.$tabLinksList = this.$elm.querySelector('.tab-link__list');
    this.$tabLinksList.addEventListener('click', this.showActiveTab.bind(this));
  }

  showActiveTab(e) {
    const lastActiveElement = this.$elm.querySelector('.' + this.activeClassName);
    if (e.target.classList.contains('tab-link')) {
      lastActiveElement.classList.remove(this.activeClassName);
      e.target.classList.add(this.activeClassName);
    } else if (e.target.classList.contains('tab-link__long-name')) {
      lastActiveElement.classList.remove(this.activeClassName);
      e.target.parentNode.classList.add(this.activeClassName);
    }

    e.preventDefault();
    e.stopPropagation();
  }
};
