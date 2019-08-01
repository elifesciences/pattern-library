'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class ArticleSection {

  constructor($elm, _window = window, doc = document) {

    if ($elm.classList.contains('article-section--first')) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.thresholdWidth = 600;
    this.initialise(this.$elm, doc);
  }

  initialise($elm, doc) {
    this.$elm.classList.add('article-section--js');
    this.$toggle = this.createToggle($elm, doc);
    this.$body = $elm.querySelector('.article-section__body');
    this.setInitialState($elm, this.$toggle, this.$body);
    this.$elm.addEventListener('expandsection', this.expand.bind(this));
    this.$elm.addEventListener('collapsesection', this.collapse.bind(this));
  }

  createToggle($elm, doc) {
    let $header = $elm.querySelector('.article-section__header');
    let $link = doc.createElement('A');
    $link.setAttribute('href', '#');
    $link.classList.add('article-section__toggle');
    $link.appendChild($header.firstElementChild);
    $header.appendChild($link);
    $link.addEventListener('click', this.toggleState.bind(this));
    return $link;
  }

  setInitialState($elm, $toggle, $body) {
    let hash = '';
    if (this.window.location && this.window.location.hash) {
      hash = this.window.location.hash.substring(1);
    }

    if (this.window.navigator.userAgent && this.window.navigator.userAgent.indexOf('Googlebot/') !== -1) {
      // Google Scholar requires article sections to be open to improve indexing
      $elm.dataset.initialState = 'opened';
    } else if (this.doc.referrer && this.doc.referrer.indexOf('.google.') !== -1) {
      // Google requires referrals to visually match the indexed version
      $elm.dataset.initialState = 'opened';
    } else if (hash && utils.isIdOfOrWithinSection(hash, $elm, this.doc)) {
      // Force open if the fragment is here.
      $elm.dataset.initialState = 'opened';
    } else if (this.viewportNoWiderThan(this.thresholdWidth)) {
      // Force closed on small screens.
      $elm.dataset.initialState = 'closed';
    }

    if ($elm.dataset.initialState === 'closed') {
      $elm.classList.add('article-section--collapsed');
      $toggle.classList.add('article-section__toggle--closed');
      $body.classList.add('visuallyhidden');
    } else {
      // Defensive: remove classes if they turn up here when they shouldn't
      $toggle.classList.remove('article-section__toggle--closed');
      $body.classList.remove('visuallyhidden');
    }

  }

  viewportNoWiderThan(thresholdInPx) {
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  toggleState(e) {
    e.preventDefault();
    if (this.$toggle.classList.contains('article-section__toggle--closed')) {
      this.$elm.dispatchEvent(utils.eventCreator('expandsection'));
    } else {
      this.$elm.dispatchEvent(utils.eventCreator('collapsesection'));
    }
  }

  collapse() {
    this.$toggle.classList.add('article-section__toggle--closed');
    this.$elm.classList.add('article-section--collapsed');
    this.$body.classList.add('visuallyhidden');
  }

  expand(e) {
    this.$toggle.classList.remove('article-section__toggle--closed');
    this.$elm.classList.remove('article-section--collapsed');
    this.$body.classList.remove('visuallyhidden');
    if (!!this.window.MathJax && !!this.window.MathJax.Hub) {
      this.window.MathJax.Hub.Queue(['Rerender', this.window.MathJax.Hub, this.$elm.id]);
    }

    try {
      if (e.detail.search(/https?:\/\//) !== 0) {
        const $descendentEl = this.doc.getElementById(e.detail);
        if (!!$descendentEl) {
          $descendentEl.scrollIntoView();
        }
      }
    } catch (err) {
      // The event may not have detail
    }
  }

};
