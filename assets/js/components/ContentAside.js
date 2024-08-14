'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.cssStickyClassName = 'content-aside__sticky';

    this.prepareTimeline(this.$elm.querySelector('.definition-list--timeline'));

    this.prepareScrollable(this.$elm);

    this.window.addEventListener('load', () => {
      utils.removeSeparatorFromLastOnLine(this.$elm, '.contextual-data__item', 'no-separator');
    });

    this.window.addEventListener('resize', () => {
      utils.removeSeparatorFromLastOnLine(this.$elm, '.contextual-data__item', 'no-separator');
    });
  }

  prepareTimeline(timeline) {
    if (timeline === null) {
      return;
    }

    const timelineParent = timeline.parentNode;
    const maxVisibleCollapsedElements = 1;

    // As each timeline entry has a dt and dd just count the dt element.
    const timelineCount = timeline.querySelectorAll('dt').length;

    const toggleTimelineVisibility = () => {
      const hasActiveClass = timeline.querySelector('.definition-list--active') !== null;
      const dtElements = timeline.querySelectorAll('dt');
      const ddElements = timeline.querySelectorAll('dd');

      for (let i = 0; i < dtElements.length; i += 1) {
        if ((hasActiveClass && !dtElements[i].classList.contains('definition-list--active')) ||
          (!hasActiveClass && i !== 0)) {
          dtElements[i].classList.toggle('hidden');
          ddElements[i].classList.toggle('hidden');
        }
      }
    };

    const toggleContent = (e) => {
      e.preventDefault();
      timelineParent.classList.toggle('toggle--expanded');
      toggleTimelineVisibility();
    };

    const createToggle = () => {
      const existingLink = timelineParent.querySelector('a.toggle');

      if (!existingLink) {
        const link = utils.buildElement('a', ['toggle']);
        link.setAttribute('href', '#');
        timelineParent.appendChild(link);
        link.addEventListener('click', toggleContent.bind(this));
      }
    };

    if (timelineCount > maxVisibleCollapsedElements) {
      createToggle();
      toggleTimelineVisibility();
    }
  }

  prepareScrollable() {
    this.window.addEventListener('resize', () => {
      this.handleScrolling();
    });

    this.window.addEventListener('scroll', () => {
      this.handleScrolling();
    });
  }

  handleScrolling() {
    if (this.isViewportWide()) {
      this.$elm.classList.add(this.cssStickyClassName);
      this.scrollbarWidth = this.$elm.offsetWidth - this.$elm.clientWidth;
      this.$elm.classList.remove(this.cssStickyClassName);
      this.yOffset = this.$elm.getBoundingClientRect().top + this.window.pageYOffset;

      if (this.window.pageYOffset >= this.yOffset) {
        this.$elm.classList.add(this.cssStickyClassName);
        this.$elm.style.marginRight = (this.scrollbarWidth * -1) + 'px';
        this.$elm.style.paddingRight = '4px';
      } else {
        this.$elm.classList.remove(this.cssStickyClassName);
        this.$elm.style.marginRight = 0;
        this.$elm.style.paddingRight = 0;
      }
    }
  }

  isViewportWide() {
    return this.window.matchMedia('(min-width: 1000px)').matches;
  }
};
