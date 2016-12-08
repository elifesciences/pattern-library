'use strict';

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

    // matches top padding in scss
    let topSpaceWhenFixed = 30;

    this.elmYOffset = this.$elm.offsetTop - topSpaceWhenFixed;
    this.window.addEventListener('scroll', this.handleScroll.bind(this));
    this.$jumpLinksToggle.addEventListener('click', this.toggleJumpLinks.bind(this));
    this.toggleJumpLinks();
  }

  handleScroll() {

    // If it's position is fixed
    if (this.$elm.classList.contains(this.cssFixedClassName)) {

      let bottomOfMain = this.doc.querySelector('[role="main"]').getBoundingClientRect().bottom;

      // Allow it to scroll again if it could keep its position & not scroll off top of screen
      if (this.window.pageYOffset < this.elmYOffset) {
        this.$elm.classList.remove(this.cssFixedClassName);

      // Allow it to scroll again if it would otherwise over-/under-lay following element
      } else if (bottomOfMain < this.$elm.offsetHeight) {
        let amountToNudgeUp = bottomOfMain - this.$elm.offsetHeight;
        this.$elm.style.top = amountToNudgeUp + 'px';
      }

    // Otherwise fix its position if it would otherwise scroll off the top of the screen
    } else if (this.window.pageYOffset >= this.elmYOffset) {
      this.$elm.classList.add(this.cssFixedClassName);
    }

  }

  toggleJumpLinks() {
    this.$jumpLinks.classList.toggle('visuallyhidden');
    this.$jumpLinksToggle.classList.toggle('view-selector__jump_links_header--closed');
    this.handleScroll();

  }

};
