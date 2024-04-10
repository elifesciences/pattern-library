'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.cssStickyClassName = 'content-aside__sticky';

    this.prepareTimeline(this.$elm.querySelector('.definition-list--timeline'));

    this.prepareScrollable(this.$elm);

    this.window.onload = this.removeSeparatorFromLastOnLine;
    this.window.addEventListener('resize', this.removeSeparatorFromLastOnLine);
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

  removeSeparatorFromLastOnLine() {
    const items = this.$elm.querySelectorAll('.contextual-data__item');

    if (items.length <= 2) {
      return;
    }

    items.forEach(function (item, index) {
      if (index < items.length - 1 && item.offsetTop !== items[index + 1].offsetTop) {
        item.classList.add('no-separator');
      } else {
        item.classList.remove('no-separator');
      }
    });
  }
};
