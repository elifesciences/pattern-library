'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class JumpMenu {

  constructor($elm, _window = window, doc = document) {

    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.linksList = this.$elm.querySelector('.jump-menu__list');
    this.links = this.$elm.querySelectorAll('.jump-menu');

    if (this.links.length > 0) {
      this.mainTarget = this.doc.querySelector('.main');
      if (!this.mainTarget) {
        return;
      }

      this.collapsibleSectionHeadings = JumpMenu.getAllCollapsibleSectionHeadings(this.doc);
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
  }

  handleHighlighting(findClosest) {
    const $firstViewableHeading = this.findFirstInView(this.collapsibleSectionHeadings, this.doc, this.window);
    const firstLogicalHeadingText = this.collapsibleSectionHeadings[0] ?
                                                  this.collapsibleSectionHeadings[0].innerHTML : '';
    const $section = JumpMenu.findSectionForLinkHighlight($firstViewableHeading, firstLogicalHeadingText, findClosest, this.doc);

    if ($section && typeof $section.id === 'string') {
      const $target = JumpMenu.findLinkToHighlight(this.linksList, `[href="#${$section.id}"]`);
      if ($target) {
        JumpMenu.updateHighlighting($target, this.links);
      }
    }
  }

  static updateHighlighting($target, linksList) {
    JumpMenu.clearJumpMenuHighlight(linksList);
    JumpMenu.highlightJumpMenu($target);
  }

  static findSectionForLinkHighlight($heading, firstHeadingText, findClosest, doc) {
    if (!$heading) {
      return;
    }

    let navigationHeight = 74;
    let tabbedNavigation = doc.querySelector('.tabbed-navigation');

    if (!tabbedNavigation || tabbedNavigation && tabbedNavigation.classList.contains('hidden')) {
      navigationHeight = 1;
    }

    // If the heading is near or off the top of the window, use the section for that heading,
    // otherwise, use the section before the section for that heading
    if ($heading.innerHTML === firstHeadingText || $heading.getBoundingClientRect().top < navigationHeight) {
      return findClosest.call(null, $heading, '.article-section');
    }

    return findClosest.call(null, $heading, '.article-section').previousElementSibling;
  }

  static clearJumpMenuHighlight(linksList) {
    const links = [].slice.call(linksList);
    links.forEach(($link) => {
      $link.classList.remove('jump-menu__active');
    });
  }

  static findLinkToHighlight($linksList, selector) {
    return $linksList.querySelector(selector);
  }

  static highlightJumpMenu($jumpMenu) {
    $jumpMenu.classList.add('jump-menu__active');
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

};
