'use strict';
var utils = require('../libs/elife-utils')();

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

    // As each timeline entry has a dt and dd just count the dt element.
    const timelineCount = timeline.querySelectorAll('dt').length;

    const toggleContent = () => {
      timelineParent.classList.toggle('toggle--expanded');
    };

    const createToggle = () => {
      const link = utils.buildElement('a', ['toggle']);
      link.setAttribute('href', '#');
      timelineParent.appendChild(link);
      link.addEventListener('click', toggleContent.bind(this));
    };

    if (timelineCount > maxVisibleCollapsedElementsOnSmallViewport) {
      createToggle();

      if (timelineCount > maxVisibleCollapsedElementsOnMediumViewport) {
        timelineParent.classList.add('toggle--count-gt-3');
      }
    }
  }
};
