'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class Collapsible {

  constructor($elm, _window = window, doc = document) {

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.viewportWidthSmall = 320;
    this.viewportWidthMedium = 729;
    this.viewportWidthLarge = 999;
    this.$listElements = Array.from(doc.querySelectorAll('.definition-list')[0].children);

    if (this.viewportNoWiderThan(this.viewportWidthMedium) && this.$listElements.length > 2) {
      this.$hiddenElements = 2;
      this.initialise(this.$elm, doc);
    } else if (this.viewportNoWiderThan(this.viewportWidthLarge) && this.$listElements.length > 6) {
      this.$hiddenElements = 6;
      this.initialise(this.$elm, doc);
    }
  }

  initialise($elm, doc) {
    this.$elm.classList.add('collapsible--js');
    this.$toggle = this.createToggle($elm, doc);
    this.$collapsibleElements = this.$listElements.slice(this.$hiddenElements, this.$listElements.length);
    this.setInitialState($elm, this.$toggle, this.$collapsibleElements);
    this.$elm.addEventListener('expandsection', this.expand.bind(this));
    this.$elm.addEventListener('collapsesection', this.collapse.bind(this));
  }

  createToggle($elm, doc) {
    let $link = doc.createElement('A');
    $link.setAttribute('href', '#');
    $link.innerHTML = ((this.$hiddenElements === 6) ? 'Show history' : 'History');
    $link.classList.add('definition-list__toggle');
    $elm.parentNode.append($link);
    $link.addEventListener('click', this.toggleState.bind(this));
    return $link;
  }

  setInitialState($elm, $toggle, $collapsibleElements) {
    let hash = '';
    if (this.window.location && this.window.location.hash) {
      hash = this.window.location.hash.substring(1);
    }

    if (this.window.navigator.userAgent && this.window.navigator.userAgent.indexOf('Googlebot/') !== -1) {
      // Google Scholar requires article timeline to be open to improve indexing
      $elm.dataset.initialState = 'opened';
    } else if (this.doc.referrer && this.doc.referrer.indexOf('.google.') !== -1) {
      // Google requires referrals to visually match the indexed version
      $elm.dataset.initialState = 'opened';
    } else if (hash && utils.isIdOfOrWithinSection(hash, $elm, this.doc)) {
      // Force open if the fragment is here.
      $elm.dataset.initialState = 'opened';
    } else if (!this.viewportNoWiderThan(this.viewportWidthLarge)) {
      // Force open on large screens.
      $elm.dataset.initialState = 'opened';
    } else if (this.viewportNoWiderThan(this.viewportWidthLarge)) {
      // Force closed on small screens.
      $elm.dataset.initialState = 'closed';
    }

    if ($elm.dataset.initialState === 'closed') {
      $elm.classList.add('toggle--collapsed');
      $toggle.classList.add('toggle--closed');
      $collapsibleElements.forEach(function (elem) {
        elem.classList.add('visuallyhidden');
      });
    } else {
      // Defensive: remove classes if they turn up here when they shouldn't
      $toggle.classList.remove('toggle--closed');
      $collapsibleElements.forEach(function (elem) {
        elem.classList.remove('visuallyhidden');
      });
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

  collapse() {
    this.$toggle.classList.add('toggle--closed');
    this.$elm.classList.add('toggle--collapsed');
    this.$toggle.innerHTML = ((this.$hiddenElements === 6) ? 'Show history' : 'History');
    this.$collapsibleElements.forEach(function (elem) {
      elem.classList.add('visuallyhidden');
    });
  }

  expand() {
    this.$toggle.classList.remove('toggle--closed');
    this.$elm.classList.remove('toggle--collapsed');
    this.$toggle.innerHTML = ((this.$hiddenElements === 6) ? 'Hide history' : 'Hide');
    this.$collapsibleElements.forEach(function (elem) {
      elem.classList.remove('visuallyhidden');
    });
  }

};
