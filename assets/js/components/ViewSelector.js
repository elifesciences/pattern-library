'use strict';

module.exports = class ViewSelector {

  constructor($elm, _window = window, doc = document) {

    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.$sideBySideListItem = this.$elm.querySelector('.view-selector__list-item--side_by_side');
    this.$sideBySideLink = this.$elm.querySelector('.view-selector__link--side_by_side');
    this.sideBySideSrc = this.$elm.dataset.sideBySideLink;
    this.$jumpLinks = this.$elm.querySelector('.view-selector__jump_links');
    this.$jumpLinksToggle = this.$elm.querySelector('.view-selector__jump_links_header');
    this.cssFixedClassName = 'view-selector--fixed';

    this.mainTarget = this.doc.querySelector('[role="main"]');

    this.$sideBySideListItem.classList.remove('hidden');

    var self = this;
    this.$sideBySideLink.addEventListener('click', function (e) {
      self.openSideBySideView();
      e.preventDefault();
    });


    // matches top padding in scss
    let topSpaceWhenFixed = 30;

    this.elmYOffset = this.$elm.offsetTop - topSpaceWhenFixed;
    this.window.addEventListener('scroll', this.handleScroll.bind(this));
    this.$jumpLinksToggle.addEventListener('click', this.toggleJumpLinks.bind(this));
    this.toggleJumpLinks();

  }

  openSideBySideView() {

    var self = this;
    function createSideBySideView(src) {
      var iFrame = self.doc.createElement('iframe');
      iFrame.src = src;
      iFrame.classList.add('side-by-side-view');
      return iFrame;
    }

    function createSideBySideCloseButton() {
      var btn = self.doc.createElement('button');
      btn.innerHTML = 'Close side-by-side view';
      btn.classList.add('close-side-by-side-view');
      return btn;
    }

    this.$sideBySideView = self.doc.querySelector('.side-by-side-view');
    //currentYScrollPos = window.pageYOffset;

    if (!this.$sideBySideView) {
      this.$sideBySideView = createSideBySideView(this.sideBySideSrc);
      self.doc.querySelector('body').appendChild(this.$sideBySideView);
    } else {
      this.$sideBySideView.classList.remove('hidden');
    }

    this.$sideBySideCloseButton = self.doc.querySelector('.close-side-by-side-view');
    if (!this.$sideBySideCloseButton) {
      this.$sideBySideCloseButton = createSideBySideCloseButton();
      this.$sideBySideCloseButton.addEventListener('click', function (e) {
        self.closeSideBySideView();
      });
      self.doc.querySelector('header').appendChild(this.$sideBySideCloseButton);
    } else {
      this.$sideBySideCloseButton.classList.remove('hidden');
    }
    //document.querySelector('main').classList.add('hidden');
    //document.querySelector('.info-bar').classList.add('hidden');
    //  var sections = document.querySelectorAll('.global-inner > section').forEach(function(s) {
    //    s.classList.add('hidden');
    //  });
    //document.querySelector('.site-footer').classList.add('hidden');
    //window.scroll(0, 0);
    //var currentYScrollPos;
  }

  closeSideBySideView() {
    this.$sideBySideCloseButton.classList.add('hidden');
    this.$sideBySideView.classList.add('hidden');
    //document.querySelector('main').classList.remove('hidden');
    //document.querySelector('.info-bar').classList.remove('hidden');
    //var sections = document.querySelectorAll('.global-inner > section').forEach(function(s) {
    //  s.classList.remove('hidden');
    //});
    //document.querySelector('.site-footer').classList.remove('hidden');
    //window.scroll(0, currentYScrollPos);
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

};
