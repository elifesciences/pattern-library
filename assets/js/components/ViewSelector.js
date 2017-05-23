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
    this.$jumpLinks = this.$elm.querySelector('.view-selector__jump_links');
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

    // matches top padding in scss
    let topSpaceWhenFixed = 30;

    this.elmYOffset = this.$elm.offsetTop - topSpaceWhenFixed;
    this.window.addEventListener('scroll', this.handleScroll.bind(this));

    if (this.$jumpLinksToggle) {
      this.$jumpLinksToggle.addEventListener('click', this.toggleJumpLinks.bind(this));
      this.toggleJumpLinks();
    }

  }

  handleScroll() {

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
    this.$jumpLinks.classList.toggle('visuallyhidden');
    this.$jumpLinksToggle.classList.toggle('view-selector__jump_links_header--closed');
    this.handleScroll();

  }

  sideBySideViewAvailable() {
    const link = this.$elm.dataset.sideBySideLink;
    return !!(link !== '' && link.match(/^https:\/\/.*$/));
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
