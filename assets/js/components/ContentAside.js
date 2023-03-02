'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.prepareTimeline(this.$elm.querySelector('.definition-list--timeline'));

    this.prepareScrollable(this.$elm);
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

  prepareScrollable() {
    this.cssStickyClassName = 'content-aside__sticky';

    this.$elm.classList.add(this.cssStickyClassName);
    this.scrollbarWidth = this.$elm.offsetWidth - this.$elm.clientWidth;
    this.marginRight = this.$elm.style.marginRight;
    this.paddingRight = this.$elm.style.paddingRight;
    this.$elm.classList.remove(this.cssStickyClassName);

    this.yOffset = this.$elm.getBoundingClientRect().top + this.window.pageYOffset;

    this.window.addEventListener('scroll', () => {
      this.handleScrolling();
    });
  }

  handleScrolling() {
    if (this.window.pageYOffset >= this.yOffset) {
      this.$elm.classList.add(this.cssStickyClassName);
      this.$elm.style.marginRight = (this.scrollbarWidth * -1) + 'px';
      this.$elm.style.paddingRight = '4px';
    } else {
      this.$elm.classList.remove(this.cssStickyClassName);
      this.$elm.style.marginRight = this.marginRight;
      this.$elm.style.paddingRight = this.paddingRight;
    }
  }
};
