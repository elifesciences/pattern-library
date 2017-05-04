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

    this.mainTarget = this.doc.querySelector('[role="main"]');
    this.$header = this.doc.querySelector('header');
    this.$global = this.$header.parentNode;
    this.eachButHeader = (callback) => {
      // NodeList doesn't have forEach in this testing environment...
      for (var i = 0; i < this.$global.childNodes.length; i++) {
        var node = this.$global.childNodes[i];
        // skip text nodes
        if (!node.tagName) {
          continue;
        }
        if (node === this.$header) {
          continue;
        }
        callback(node);
      }
    };


    this.sideBySideSrc = this.$elm.dataset.sideBySideLink;
    this.$sideBySideListItem = this.doc.createElement('li');
    this.$sideBySideListItem.classList.add("view-selector__list-item");
    this.$sideBySideListItem.classList.add("view-selector__list-item--side-by-side");
    var $sideBySideLink = this.doc.createElement('a');
    $sideBySideLink.setAttribute("href", "#");
    $sideBySideLink.classList.add("view-selector__link");
    $sideBySideLink.classList.add("view-selector__link--side-by-side");
    $sideBySideLink.innerHTML = '<span>Side by side view</span>';
    $sideBySideLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.openSideBySideView();
    });
    this.$sideBySideListItem.appendChild($sideBySideLink);
    var $list = this.doc.querySelector('.view-selector__list');
    var $jumpList = this.doc.querySelector('.view-selector__list-item--jump');
    $list.insertBefore(this.$sideBySideListItem, $jumpList);


    // matches top padding in scss
    let topSpaceWhenFixed = 30;

    this.elmYOffset = this.$elm.offsetTop - topSpaceWhenFixed;
    this.window.addEventListener('scroll', this.handleScroll.bind(this));
    this.$jumpLinksToggle.addEventListener('click', this.toggleJumpLinks.bind(this));
    this.toggleJumpLinks();

  }

  openSideBySideView() {

    var createSideBySideView = (src) => {
      var iFrame = this.doc.createElement('iframe');
      iFrame.src = src;
      iFrame.classList.add('side-by-side-view');
      return iFrame;
    };

    var createSideBySideCloseButton = () => {
      var btn = this.doc.createElement('button');
      btn.innerHTML = 'Close side-by-side view';
      btn.classList.add('close-side-by-side-view');
      return btn;
    };

    this._saveScrollingPosition();

    this.$sideBySideView = this.doc.querySelector('.side-by-side-view');
    if (!this.$sideBySideView) {
      this.$sideBySideView = createSideBySideView(this.sideBySideSrc);
      this.doc.querySelector('body').appendChild(this.$sideBySideView);
    } else {
      this.$sideBySideView.classList.remove('hidden');
    }

    this.$sideBySideCloseButton = this.doc.querySelector('.close-side-by-side-view');
    if (!this.$sideBySideCloseButton) {
      this.$sideBySideCloseButton = createSideBySideCloseButton();
      this.$sideBySideCloseButton.addEventListener('click', (e) => {
        this.closeSideBySideView();
      });
      this.$header.appendChild(this.$sideBySideCloseButton);
    } else {
      this.$sideBySideCloseButton.classList.remove('hidden');
    }
    this.eachButHeader((node) => {
      node.classList.add('hidden');
    });
  }

  closeSideBySideView() {
    this.$sideBySideCloseButton.classList.add('hidden');
    this.$sideBySideView.classList.add('hidden');
    this.eachButHeader((node) => {
      node.classList.remove('hidden');
    });

    this._restoreScrollingPosition();
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

  _saveScrollingPosition() {
    this.currentYScrollPos = this.window.pageYOffset;
    window.scroll(0, 0);
  }
  
  _restoreScrollingPosition() {
    window.scroll(0, this.currentYScrollPos);
    this.currentYScrollPos = null;
  }
};
