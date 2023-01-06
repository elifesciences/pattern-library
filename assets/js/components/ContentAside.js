'use strict';

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.prepareTimeline(this.$elm.querySelector('.definition-list--timeline'));
  }

  prepareTimeline(timeline) {
    if (timeline === null) {
      return;
    }

    const timelineParent = timeline.parentNode;
    const maxVisibleCollapsedElementsOnSmallViewport = 1;
    const maxVisibleCollapsedElementsOnMediumViewport = 3;
    const timelineCount = timeline.querySelectorAll('dt').length;

    const toggleContent = () => {
      timelineParent.classList.toggle('toggle--collapsed');
    };

    const createToggle = () => {
      let $link = this.doc.createElement('A');
      $link.setAttribute('href', '#');
      $link.classList.add('toggle');
      timelineParent.appendChild($link);
      $link.addEventListener('click', toggleContent.bind(this));
    };

    if (timelineCount > maxVisibleCollapsedElementsOnSmallViewport) {
      createToggle();
      toggleContent();
    }

    if (timelineCount > maxVisibleCollapsedElementsOnMediumViewport) {
      timelineParent.classList.add('toggle--count-gt-3');
    }
  }
};
