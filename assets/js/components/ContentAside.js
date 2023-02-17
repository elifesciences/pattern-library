'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.mainTarget = this.doc.querySelector('.main');

    this.prepareTimeline(this.$elm.querySelector('.definition-list--timeline'));
    this.createScrollabeAside();
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

  createScrollabeAside() {
    if (!this.mainTarget) {
      return;
    }

    this.isScrollingHandled = false;
    this.cssStickyClassName = 'content-aside__sticky';
    this.$contentHeader = this.doc.querySelector('.content-header');

    const scrollingHandler = utils.throttle(() => {
      this.handleScrolling();
    }, 50);

    if (this.isViewportWideWithContentAside()) {
      this.startHandlingScrolling(scrollingHandler, this.handleScrolling);
    }

    this.window.addEventListener('resize', utils.throttle(() => {
      this.handleResize(scrollingHandler, this.handleScrolling);
    }, 200));
  }

  startHandlingScrolling(scrollingHandler, scrollingHandlerImmediate) {
    this.window.addEventListener('scroll', scrollingHandler);
    this.isScrollingHandled = true;
    scrollingHandlerImmediate.call(this);
  }

  stopHandlingScrolling(scrollingHandler) {
    this.window.removeEventListener('scroll', scrollingHandler);
    this.isScrollingHandled = false;
  }

  handleScrolling() {
    if (!this.$contentHeader) {
      return;
    }

    this.asidePaddingRight = 0;

    if (this.isViewportWideWithContentAside()) {
      this.asidePaddingRight = 4;

      // Detect aside scollbar width
      this.$elm.classList.add(this.cssStickyClassName);
      this.scrollbarWidth = this.$elm.offsetWidth - this.$elm.clientWidth;
      this.$elm.classList.remove(this.cssStickyClassName);

      this.$elm.style.marginRight = (this.scrollbarWidth * -1) + 'px';
      this.$elm.style.paddingRight = this.scrollbarWidth + this.asidePaddingRight + 'px';
    }

    let topOfContentHeader = this.$contentHeader.getBoundingClientRect().top;

    // If it's position is sticky
    if (this.$elm.classList.contains(this.cssStickyClassName)) {

      // If Contextual Data shows on the screen then remove sticky aside
      if (topOfContentHeader > 0) {
        this.$elm.classList.remove(this.cssStickyClassName);
        this.$elm.style.paddingRight = this.scrollbarWidth + this.asidePaddingRight + 'px';
        return;
      }

      // Allow it to scroll again if it would otherwise over-/under-lay following element
      let bottomOfMain = this.mainTarget.getBoundingClientRect().bottom;
      if (bottomOfMain < this.$elm.offsetHeight) {
        let amountToNudgeUp = bottomOfMain - this.$elm.offsetHeight;
        this.$elm.style.top = amountToNudgeUp + 'px';
        return;
      }

      // Ensure top of component is not off top of screen once bottom of main is off screen bottom
      // Safety net: required because a fast scroll may prevent all code running as desired.
      if (bottomOfMain >= this.window.innerHeight) {
        this.$elm.style.top = '0px';
      }

      return;
    }

    // Otherwise stick its position if it would otherwise scroll off the top of the screen
    if (topOfContentHeader < 0) {
      this.$elm.classList.add(this.cssStickyClassName);
      this.$elm.style.top = '0px';
      this.$elm.style.paddingRight = this.asidePaddingRight + 'px';
    }
  }

  isViewportWideWithContentAside() {
    return this.window.matchMedia('(min-width: 900px)').matches;
  }

  handleResize(scrollingHandler, scrollingHandlerImmediate) {
    const isViewportWideWithContentAside = this.isViewportWideWithContentAside();
    if (!this.isScrollingHandled && isViewportWideWithContentAside) {
      this.startHandlingScrolling(scrollingHandler, scrollingHandlerImmediate);
    } else if (this.isScrollingHandled && !isViewportWideWithContentAside) {
      this.stopHandlingScrolling(scrollingHandler);
    }
  }
};
