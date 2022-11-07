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
    this.$jumpLinksList = this.$elm.querySelector('.view-selector__list');
    this.jumpLinks = this.$elm.querySelectorAll('.view-selector__jump_link');
    this.cssFixedClassName = 'view-selector--fixed';
    this.$navDetect = this.doc.querySelector('.content-container-grid');
    this.$mainViewSelector = this.$elm.querySelector('.main-selector');
    this.$secondarySelector = this.$elm.querySelector('.secondary-selector');
    this.$mainListingArea = this.doc.getElementById('mainListing');
    this.$secondaryListingArea = this.doc.getElementById('secondaryListing');
    this.$activeViewSelector = 'view-selector__list-item--active';
    this.$displayUnset = 'display-unset';
    this.$displayHide = 'display-hide';

    if (this.sideBySideViewAvailable()) {
      const $header = this.doc.getElementById('siteHeader');
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

    this.$mainViewSelector.addEventListener('click', (e) => {
      e.preventDefault();
      this.selectedSection(this.$mainViewSelector, this.$mainListingArea, this.$secondaryListingArea);
    });

    this.$secondarySelector.addEventListener('click', (e) => {
      e.preventDefault();
      this.selectedSection(this.$secondarySelector, this.$secondaryListingArea, this.$mainListingArea);
    });

    this.displayActiveSectionInitially();
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
    const $attachBefore = this.doc.querySelector('.view-selector__list-item--figures + .view-selector__list-item');

    if (!$attachBefore) {
      return;
    }

    const $listItem = utils.buildElement(
      'li',
      [
        'view-selector__list-item',
        'view-selector__list-item--side-by-side',
      ],
      '',
      $list,
      $attachBefore
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

  selectedSection(clickedElement, visibleArea, hiddenArea) {
    this.addActiveClass(clickedElement);
    this.showSelectedArea(visibleArea, hiddenArea);
  }

  addActiveClass(clickedElement) {
    const activeElement = this.$elm.querySelector('.view-selector__list-item--active');
    activeElement.classList.remove(this.$activeViewSelector);
    clickedElement.parentNode.classList.add(this.$activeViewSelector);
  }

  showSelectedArea(visibleArea, hiddenArea) {
    visibleArea.classList.add(this.$displayUnset);
    visibleArea.classList.remove(this.$displayHide);
    hiddenArea.classList.add(this.$displayHide);
    hiddenArea.classList.remove(this.$displayUnset);
  }

  displayActiveSectionInitially() {
    if (this.$mainViewSelector.parentNode.classList.contains(this.$activeViewSelector)) {
      this.$secondaryListingArea.classList.add(this.$displayHide);
    } else if (this.$secondarySelector.parentNode.classList.contains(this.$activeViewSelector)) {
      this.$mainListingArea.classList.add(this.$displayHide);
    }
  }
};
