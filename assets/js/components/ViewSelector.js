'use strict';

const SideBySideView = require('./SideBySideView');
const utils = require('../libs/elife-utils')();

module.exports = class ViewSelector {

  constructor($elm, _window = window, doc = document) {

    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.$jumpLinksList = this.$elm.querySelector('.view-selector__jump_links');
    this.jumpLinks = this.$elm.querySelectorAll('.view-selector__jump_link');
    this.$jumpLinksToggle = this.$elm.querySelector('.view-selector__jump_links_header');
    this.cssFixedClassName = 'view-selector--fixed';

    if (this.sideBySideViewAvailable()) {
      const $header = this.doc.querySelector('#siteHeader');
      this.$global = this.doc.querySelector('.global-inner');
      this.sideBySideView = new SideBySideView(
        this.$global,
        this.$elm.dataset.sideBySideLink,
        $header,
        this.window,
        this.doc
      );

      this.insertSideBySideListItem();
    }

    this.mainTarget = this.doc.querySelector('.main');
    if (!this.mainTarget) {
      return;
    }

    // matches top padding in scss
    let topSpaceWhenFixed = 30;

    this.collapsibleSectionHeadings = ViewSelector.getAllCollapsibleSectionHeadings(this.doc);
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

    this.elmYOffset = this.$elm.offsetTop - topSpaceWhenFixed;
    if (this.$jumpLinksToggle) {
      this.$jumpLinksToggle.addEventListener('click', this.toggleJumpLinks.bind(this));
      this.toggleJumpLinks();
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
    if (this.$jumpLinksList) {
      this.handleHighlighting(utils.closest);
    }

    this.handlePositioning();
  }

  handleHighlighting(findClosest) {
    const $firstViewableHeading = this.findFirstInView(this.collapsibleSectionHeadings,
                                                       this.doc, this.window);
    const firstLogicalHeadingText = this.collapsibleSectionHeadings[0] ?
                                                  this.collapsibleSectionHeadings[0].innerHTML : '';
    const $section = ViewSelector.findSectionForLinkHighlight($firstViewableHeading,
                                                              firstLogicalHeadingText,
                                                              findClosest);

    if ($section && typeof $section.id === 'string') {
      const $target = ViewSelector.findLinkToHighlight(this.$jumpLinksList, `[href="#${$section.id}"]`);
      if ($target) {
        ViewSelector.updateHighlighting($target, this.jumpLinks);
      }
    }
  }

  static updateHighlighting($target, jumpLinksList) {
    ViewSelector.clearJumpLinkHighlight(jumpLinksList);
    ViewSelector.highlightJumpLink($target);
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

  static clearJumpLinkHighlight(jumpLinksList) {
    const linksList = [].slice.call(jumpLinksList);
    linksList.forEach(($link) => {
      $link.classList.remove('view-selector__jump_link--active');
    });
  }

  static findLinkToHighlight($linksList, selector) {
    return $linksList.querySelector(selector);
  }

  static highlightJumpLink($jumpLink) {
    $jumpLink.classList.add('view-selector__jump_link--active');
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
    // If it's position is fixed
    if (this.$elm.classList.contains(this.cssFixedClassName)) {

      // Allow it to scroll again if it could keep its position & not scroll off top of screen
      if (this.window.pageYOffset < this.elmYOffset) {
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
    if (this.window.pageYOffset >= this.elmYOffset) {
      this.$elm.classList.add(this.cssFixedClassName);
      this.$elm.style.top = '0px';
    }
  }

  toggleJumpLinks() {
    this.$jumpLinksList.classList.toggle('visuallyhidden');
    this.$jumpLinksToggle.classList.toggle('view-selector__jump_links_header--closed');
  }

  sideBySideViewAvailable() {
    const link = this.$elm.dataset.sideBySideLink;
    const isLinkProvided = () => !!(link && link.match(/^https:\/\/.*$/));
    const isSideBySideViewLikelySupported = () => {
      try {
        if (!(this.window.CSS && this.window.CSS.supports)) {
          return false;
        }
      } catch (e) {
        return false;
      }

      // Proxy for IE/Edge, that Lens doesn't support. Dirty :-(
      return this.window.CSS.supports('text-orientation', 'sideways') ||
             this.window.CSS.supports('-webkit-text-orientation', 'sideways');
    };

    return isLinkProvided() && isSideBySideViewLikelySupported();
  }

  insertSideBySideListItem() {
    const $list = this.doc.querySelector('.view-selector__list');
    const $jumpList = this.doc.querySelector('.view-selector__list-item--jump');
    const $listItem = utils.buildElement(
      'li',
      [
        'view-selector__list-item',
        'view-selector__list-item--side-by-side',
      ],
      '',
      $list,
      $jumpList
    );
    const $link = utils.buildElement(
      'a',
      [
        'view-selector__link',
        'view-selector__link--side-by-side',
      ],
      '<span>Side by side</span>',
      $listItem
    );
    $link.setAttribute('href', this.$elm.dataset.sideBySideLink);
    $link.addEventListener('click', (e) => {
      e.preventDefault();
      this.sideBySideView.open();
    });
    return $listItem;
  }
};
