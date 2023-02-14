'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.mainTarget = this.doc.querySelector('.main');

    this.prepareTimeline(this.$elm.querySelector('.definition-list--timeline'));
    this.setAsideTopPadding();
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

  setAsideTopPadding() {
    if (this.isViewportWideWithContentAside()) {
      this.contentHeaderGridTopElement = this.doc.querySelector('.content-header-grid-top');
      if (!this.contentHeaderGridTopElement) {
        return;
      }

      this.contentHeaderGridTopHeight = this.contentHeaderGridTopElement.offsetHeight;
      this.contentHeaderGridStyle = this.window.getComputedStyle(this.contentHeaderGridTopElement);
      this.contentHeaderGridMarginTop = parseInt(this.contentHeaderGridStyle.marginTop);
      this.contentHeaderGridMarginBottom = parseInt(this.contentHeaderGridStyle.marginBottom);
      this.$elm.style.paddingTop = this.contentHeaderGridTopHeight +
        this.contentHeaderGridMarginTop + this.contentHeaderGridMarginBottom + 'px';
    }
  }

  createScrollabeAside() {
    if (!this.mainTarget) {
      return;
    }

    this.isScrollingHandled = false;
    this.cssStickyClassName = 'content-aside__sticky';
    this.$contentHeaderTop = this.doc.querySelector('.content-header-grid-top');

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
    if (!this.$contentHeaderTop) {
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
      this.setAsideTopPadding();
    }

    let bottomOfContentHeaderTop = this.$contentHeaderTop.getBoundingClientRect().bottom;

    // If it's position is sticky
    if (this.$elm.classList.contains(this.cssStickyClassName)) {

      // If Contextual Data shows on the screen then remove sticky aside
      if (bottomOfContentHeaderTop > 0) {
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
    if (bottomOfContentHeaderTop < 0) {
      this.$elm.classList.add(this.cssStickyClassName);
      this.$elm.style.top = '0px';
      this.$elm.style.paddingTop = '60px';
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
