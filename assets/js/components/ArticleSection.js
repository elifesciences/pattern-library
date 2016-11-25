'use strict';

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
    this.window.addEventListener('DOMContentLoaded', this.handleSectionOpeningViaHash.bind(this));
    this.window.addEventListener('hashchange', this.handleSectionOpeningViaHash.bind(this));
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
    this.$headerLink.classList.toggle('article-section__header_link--closed');
    this.$elm.classList.toggle('article-section--collapsed');
    this.$body.classList.toggle('visuallyhidden');
    if (!this.$body.classList.contains('visuallyhidden')) {
      this.window.MathJax.Hub.Queue(['Rerender', this.window.MathJax.Hub, this.$elm.id]);
    }
  }

  static openSection(section) {
    section.$headerLink.classList.remove('article-section__header_link--closed');
    section.$elm.classList.remove('article-section--collapsed');
    let isHidden = section.$body.classList.contains('visuallyhidden');
    section.$body.classList.remove('visuallyhidden');
    if (isHidden && this.window.MathJax.Hub) {
      this.window.MathJax.Hub.Queue(['Rerender', this.window.MathJax.Hub, section.$elm.id]);
    }
  }

  handleSectionOpeningViaHash(e) {

    // TODO: Code similar to that in Audipplayer.seekNewTime(), consider refactoring out into common
    let hash = '';

    // event was hashChange
    if (!!e.newURL) {
      hash = e.newURL.substring(e.newURL.indexOf('#') + 1);
    } else {
      hash = this.window.location.hash.substring(1);
    }

    if (!hash) {
      return false;
    }

    if (ArticleSection.isFragmentForCollapsibleSection(hash, this.doc)) {
      ArticleSection.openSection(this);
    }
  }

  static isFragmentForCollapsibleSection(fragment, document) {
    var $elFromFragmentId = document.querySelector('#' + fragment);
    if (!$elFromFragmentId) {
      return false;
    }

    let behaviour = $elFromFragmentId.dataset.behaviour;
    return behaviour && behaviour.indexOf('ArticleSection') > -1;
  }

};
