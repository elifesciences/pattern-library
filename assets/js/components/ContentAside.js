'use strict';

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.prepareTimeline(this.$elm.querySelector('.definition-list--timeline'));
  }

  prepareTimeline(timeline) {
    const viewportWidthMedium = 729;
    const viewportWidthLarge = 899;
    const maxVisibleCollapsedElementsOnSmallViewport = 2;
    const maxVisibleCollapsedElementsOnMediumViewport = 6;
    const listElements = Array.prototype.slice.call(timeline.children);

    const viewportNoWiderThan = (thresholdInPx) => this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;

    const alignToggle = (toggle) => {
      const elements = timeline.querySelectorAll('dt');
      const lastElement = elements[elements.length - 1];
      toggle.style.marginBottom = lastElement.offsetHeight + 'px';
    };

    const toggleContent = (toggle) => {
      if (timeline.parentNode.classList.contains('toggle--collapsed')) {
        timeline.parentNode.classList.remove('toggle--collapsed');
        if (viewportNoWiderThan(viewportWidthMedium)) {
          alignToggle(toggle);
        }
      } else {
        timeline.parentNode.classList.add('toggle--collapsed');
      }
    };

    const createToggle = () => {
      let $link = this.doc.createElement('A');
      $link.setAttribute('href', '#');
      $link.classList.add('toggle');
      timeline.parentNode.appendChild($link);
      $link.addEventListener('click', toggleContent.bind(this));
      return $link;
    };

    if (
      viewportNoWiderThan(viewportWidthMedium) && listElements.length > maxVisibleCollapsedElementsOnSmallViewport ||
      viewportNoWiderThan(viewportWidthLarge) && listElements.length > maxVisibleCollapsedElementsOnMediumViewport
    ) {
      const toggle = createToggle();
      toggleContent(toggle);
    }
  }
};
