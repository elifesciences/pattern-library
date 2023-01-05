'use strict';

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.viewportWidthMedium = 729;
    this.viewportWidthLarge = 899;
    this.maxVisibleCollapsedElementsOnSmallViewport = 2;
    this.maxVisibleCollapsedElementsOnMediumViewport = 6;
    this.listElements = Array.prototype.slice.call($elm.querySelector('.definition-list--timeline').children);

    if (this.viewportNoWiderThan(this.viewportWidthMedium) &&
      this.listElements.length > this.maxVisibleCollapsedElementsOnSmallViewport) {
      this.$toggle = this.createToggle();
      this.toggleContent();
    } else if (this.viewportNoWiderThan(this.viewportWidthLarge) &&
      this.listElements.length > this.maxVisibleCollapsedElementsOnMediumViewport) {
      this.$toggle = this.createToggle();
      this.toggleContent();
    }
  }

  createToggle() {
    let $link = this.doc.createElement('A');
    $link.setAttribute('href', '#');
    $link.classList.add('toggle');
    this.$elm.appendChild($link);
    $link.addEventListener('click', this.toggleContent.bind(this));
    return $link;
  }

  toggleContent() {
    if (this.$elm.classList.contains('toggle--collapsed')) {
      this.$elm.classList.remove('toggle--collapsed');
      if (this.viewportNoWiderThan(this.viewportWidthMedium)) {
        this.alignToggle();
      }
    } else {
      this.$elm.classList.add('toggle--collapsed');
    }
  }

  viewportNoWiderThan(thresholdInPx) {
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  alignToggle() {
    let elements = this.$elm.querySelectorAll('.definition-list--timeline dt');
    let lastElement = elements[elements.length - 1];
    this.$toggle.style.marginBottom = lastElement.offsetHeight + 'px';
  }
};
