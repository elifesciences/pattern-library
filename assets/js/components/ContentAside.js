'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.prepareTimeline(this.$elm.querySelector('.definition-list--timeline'));
    this.handleSpaceWithScrollBar();

    this.window.addEventListener('resize', utils.throttle(() => {
      this.handleSpaceWithScrollBar();
    }, 200));
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

    const toggleContent = (e) => {
      e.preventDefault();
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

  handleSpaceWithScrollBar() {
    let scrollbarWidth = this.$elm.offsetWidth - this.$elm.clientWidth;
    this.addAdditionalMarginIfScrollBarIsVisible(scrollbarWidth);
  }

  addAdditionalMarginIfScrollBarIsVisible(scrollbarWidth) {
    if (scrollbarWidth > 0) {
      this.$elm.style.marginRight = (scrollbarWidth * -1) + 'px';
    } else {
      this.$elm.style.marginRight = '0px';
    }
  }
};
