'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.prepareTimeline(this.$elm.querySelector('.definition-list--timeline'));

    this.prepareScrollableContentAside(this.$elm);
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

  prepareScrollableContentAside(contentAside) {
    const stickyClass = 'content-aside__sticky';
    const scrollbarWidth = contentAside.offsetWidth - contentAside.clientWidth;
    const marginRight = contentAside.style.marginRight;
    const paddingRight = contentAside.style.paddingRight;

    contentAside.classList.remove(stickyClass);

    const contentAsideYOffset = contentAside.getBoundingClientRect().top + this.window.pageYOffset;

    this.window.addEventListener('scroll', () => {
      if (this.window.pageYOffset >= contentAsideYOffset) {
        contentAside.classList.add(stickyClass);
        contentAside.style.marginRight = (scrollbarWidth * -1) + 'px';
        contentAside.style.paddingRight = '4px';
      } else {
        contentAside.classList.remove(stickyClass);
        contentAside.style.marginRight = marginRight;
        contentAside.style.paddingRight = paddingRight;
      }
    });
  }
};
