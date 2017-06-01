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
    this.$headerLink = this.createHeaderLink($elm, doc);
    this.$body = $elm.querySelector('.article-section__body');
    this.setInitialState($elm, this.$headerLink, this.$body);
    this.$elm.addEventListener('expandsection', this.expand.bind(this));
    this.$elm.addEventListener('collapsesection', this.collapse.bind(this));
  }

  createHeaderLink($elm, doc) {
    let $header = $elm.querySelector('.article-section__header');
    let $link = doc.createElement('A');
    $link.setAttribute('href', '#');
    $link.classList.add('article-section__header_link');
    $link.appendChild($header.firstElementChild);
    $header.appendChild($link);
    $link.addEventListener('click', this.toggleState.bind(this));
    return $link;
  }

  setInitialState($elm, $headerLink, $body) {
    if ($elm.dataset.initialState === 'closed' || this.viewportNoWiderThan(this.thresholdWidth)) {
      $elm.classList.add('article-section--collapsed');
      $headerLink.classList.add('article-section__header_link--closed');
      $body.classList.add('visuallyhidden');
    } else {
      // Defensive: remove classes if they turn up here when they shouldn't
      $headerLink.classList.remove('article-section__header_link--closed');
      $body.classList.remove('visuallyhidden');
    }

  }

  viewportNoWiderThan(thresholdInPx) {
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  toggleState(e) {
    e.preventDefault();
    if (this.$headerLink.classList.contains('article-section__header_link--closed')) {
      this.$elm.dispatchEvent(utils.eventCreator('expandsection'));
    } else {
      this.$elm.dispatchEvent(utils.eventCreator('collapsesection'));
    }
  }

  collapse() {
    this.$headerLink.classList.add('article-section__header_link--closed');
    this.$elm.classList.add('article-section--collapsed');
    this.$body.classList.add('visuallyhidden');
  }

  expand(e) {
    this.$headerLink.classList.remove('article-section__header_link--closed');
    this.$elm.classList.remove('article-section--collapsed');
    this.$body.classList.remove('visuallyhidden');
    if (!!this.window.MathJax) {
      this.window.MathJax.Hub.Queue(['Rerender', this.window.MathJax.Hub, this.$elm.id]);
    }

    try {
      if (e.detail.indexOf('http') !== 0) {
        let $descendentEl = this.doc.querySelector('#' + e.detail);
        if (!!$descendentEl) {
          $descendentEl.scrollIntoView();
        }
      }
    } catch (err) {
      // The event may not have detail
    }
  }

};
