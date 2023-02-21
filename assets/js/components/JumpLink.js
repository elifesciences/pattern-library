'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class JumpLink {

  constructor($elm, _window = window, doc = document) {

    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.linksList = this.$elm.querySelector('.jump-link__list');
    this.links = this.$elm.querySelectorAll('.jump-link');
    this.cssFixedClassName = 'jump-link__fixed';
    this.$navDetect = this.doc.querySelector('.content-container-grid');

    if (this.links.length > 0) {
      this.mainTarget = this.doc.querySelector('.main');
      if (!this.mainTarget) {
        return;
      }

      this.collapsibleSectionHeadings = JumpLink.getAllCollapsibleSectionHeadings(this.doc);
      this.isScrollingHandled = false;

      const scrollingHandler = utils.throttle(() => {
        this.handleScrolling();
      }, 50);

      if (this.isViewportWideEnoughForJumpMenu()) {
        this.startHandlingScrolling(scrollingHandler, this.handleScrolling);
      }

      this.window.addEventListener('resize', utils.throttle(() => {
        this.handleResize(scrollingHandler, this.handleScrolling);
      }, 200));
    }
  }

  static getAllCollapsibleSectionHeadings (doc) {
    return doc.querySelectorAll(
      '[data-behaviour="ArticleSection"] > .article-section__header .article-section__header_text');
  }

  isViewportWideEnoughForJumpMenu() {
    return this.window.matchMedia('(min-width: 1200px)').matches;
  }

  handleResize(scrollingHandler, scrollingHandlerImmediate) {
    const isViewportWideEnoughForJumpMenu = this.isViewportWideEnoughForJumpMenu();
    if (!this.isScrollingHandled && isViewportWideEnoughForJumpMenu) {
      this.startHandlingScrolling(scrollingHandler, scrollingHandlerImmediate);
    } else if (this.isScrollingHandled && !isViewportWideEnoughForJumpMenu) {
      this.stopHandlingScrolling(scrollingHandler);
    }
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
    this.handleHighlighting(utils.closest);
    this.handlePositioning();
  }

  handleHighlighting(findClosest) {
    const $firstViewableHeading = this.findFirstInView(this.collapsibleSectionHeadings,
                                                       this.doc, this.window);
    const firstLogicalHeadingText = this.collapsibleSectionHeadings[0] ?
                                                  this.collapsibleSectionHeadings[0].innerHTML : '';
    const $section = JumpLink.findSectionForLinkHighlight($firstViewableHeading,
                                                              firstLogicalHeadingText,
                                                              findClosest);

    if ($section && typeof $section.id === 'string') {
      const $target = JumpLink.findLinkToHighlight(this.linksList, `[href="#${$section.id}"]`);
      if ($target) {
        JumpLink.updateHighlighting($target, this.links);
      }
    }
  }

  static updateHighlighting($target, linksList) {
    JumpLink.clearJumpLinkHighlight(linksList);
    JumpLink.highlightJumpLink($target);
  }

  static findSectionForLinkHighlight($heading, firstHeadingText, findClosest) {
    if (!$heading) {
      return;
    }

    // If the heading is near or off the top of the window, use the section for that heading,
    // otherwise, use the section before the section for that heading
    if ($heading.innerHTML === firstHeadingText || $heading.getBoundingClientRect().top < 48) {
      return findClosest.call(null, $heading, '.article-section');
    }

    return findClosest.call(null, $heading, '.article-section').previousElementSibling;
  }

  static clearJumpLinkHighlight(linksList) {
    const links = [].slice.call(linksList);
    links.forEach(($link) => {
      $link.classList.remove('jump-link__active');
    });
  }

  static findLinkToHighlight($linksList, selector) {
    return $linksList.querySelector(selector);
  }

  static highlightJumpLink($jumpLink) {
    $jumpLink.classList.add('jump-link__active');
  }

  /**
   * Returns the first HTMLElement in the list that is in view
   * @param {NodeList|Array} elementList
   * @param {Document} doc
   * @param {Window} win
   * @returns {(HTMLElement|null)}
   */
  findFirstInView(elementList, doc, win) {
    // Ensure elements is an array
    const elements = [].slice.call(elementList);
    let $found = null;
    elements.forEach(($el) => {
      if (!$found) {
        if (utils.isTopInView($el, doc, win)) {
          $found = $el;
        }
      }
    });

    return $found;
  }

  handlePositioning() {
    let bottomOfNav = this.$navDetect.getBoundingClientRect().bottom;

    // If it's position is fixed
    if (this.$elm.classList.contains(this.cssFixedClassName)) {

      // If Contextual Data shows on the screen then remove fixed navigation
      if (bottomOfNav > 0) {
        this.$elm.classList.remove(this.cssFixedClassName);
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

    // Otherwise fix its position if it would otherwise scroll off the top of the screen
    if (bottomOfNav < 0) {
      this.$elm.classList.add(this.cssFixedClassName);
      this.$elm.style.top = '0px';
    }
  }
};
