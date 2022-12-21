'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class ContentAside {

  constructor($elm, _window = window, doc = document) {

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.viewportWidthMedium = 729;
    this.viewportWidthLarge = 899;
    this.maxVisibleCollapsedElementsOnSmallViewport = 2;
    this.maxVisibleCollapsedElementsOnMediumViewport = 6;
    this.listElements = Array.prototype.slice.call($elm.querySelector('.definition-list--timeline').children);
    if (this.viewportNoWiderThan(this.viewportWidthLarge) &&
      this.listElements.length < this.maxVisibleCollapsedElementsOnMediumViewport) {
      return;
    }

    this.$toggle = this.createToggle();
    this.initialise();
    this.window.addEventListener('resize', this.initialiseOnResize.bind(this));
  }

  initialise() {
    this.$elm.classList.add('content-aside--js');
    this.setInitialState();
    this.$elm.addEventListener('expandsection', this.expand.bind(this));
    this.$elm.addEventListener('collapsesection', this.collapse.bind(this));
  }

  createToggle() {
    let $link = this.doc.createElement('A');
    $link.setAttribute('href', '#');
    $link.classList.add('toggle');
    this.$elm.appendChild($link);
    $link.addEventListener('click', this.toggleState.bind(this));
    return $link;
  }

  setInitialState() {
    if (this.window.navigator.userAgent && this.window.navigator.userAgent.indexOf('Googlebot/') !== -1) {
      // Google Scholar requires article timeline to be open to improve indexing
      this.$elm.dataset.initialState = 'opened';
    } else if (this.doc.referrer && this.doc.referrer.indexOf('.google.') !== -1) {
      // Google requires referrals to visually match the indexed version
      this.$elm.dataset.initialState = 'opened';
    } else if (this.viewportNoWiderThan(this.viewportWidthLarge)) {
      // Force closed on small screens.
      this.$elm.dataset.initialState = 'closed';
    }

    this.toggleContent();
  }

  toggleContent() {
    if (this.$elm.dataset.initialState === 'closed') {
      this.$elm.classList.add('toggle--collapsed');
      this.$toggle.classList.add('toggle--closed');
    } else {
      // Defensive: remove classes if they turn up here when they shouldn't
      this.$toggle.classList.remove('toggle--closed');
    }
  }

  initialiseOnResize() {
    if (!this.viewportNoWiderThan(this.viewportWidthLarge)) {
      return;
    }

    if (this.$toggle) {
      if (this.viewportNoWiderThan(this.viewportWidthMedium) &&
        this.listElements.length > this.maxVisibleCollapsedElementsOnSmallViewport) {
        this.alignToggle();
      } else if (this.viewportNoWiderThan(this.viewportWidthLarge) &&
        this.listElements.length > this.maxVisibleCollapsedElementsOnMediumViewport) {
        this.$toggle.removeAttribute('style');
      }
    }
  }

  viewportNoWiderThan(thresholdInPx) {
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  toggleState(e) {
    e.preventDefault();
    if (this.$toggle.classList.contains('toggle--closed')) {
      this.$elm.dispatchEvent(utils.eventCreator('expandsection'));
    } else {
      this.$elm.dispatchEvent(utils.eventCreator('collapsesection'));
    }
  }

  alignToggle() {
    let lastElementsHeight = this.listElements.slice(this.listElements.length - 2);

    let toggleHeight = 0;
    lastElementsHeight.forEach(function (elem) {
      toggleHeight += elem.offsetHeight;
    });

    this.$toggle.style.height = toggleHeight + 'px';
  }

  collapse() {
    this.$toggle.classList.add('toggle--closed');
    this.$elm.classList.add('toggle--collapsed');
    this.$elm.dataset.initialState = 'closed';

    if (this.viewportNoWiderThan(this.viewportWidthMedium)) {
      this.alignToggle();
    }
  }

  expand() {
    this.$toggle.classList.remove('toggle--closed');
    this.$elm.classList.remove('toggle--collapsed');
    this.$elm.dataset.initialState = 'opened';

    if (this.viewportNoWiderThan(this.viewportWidthMedium)) {
      this.alignToggle();
    }
  }

};
