'use strict';

module.exports = class ArticleSection {

  constructor($elm, _window = window, doc = document) {

    if ($elm.classList.contains('article-section--first')) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.initialise(this.$elm, doc);

  }

  initialise($elm, doc) {
    this.$elm.classList.add('article-section--js');
    this.$headerLink = this.createHeaderLink($elm, doc);
    this.$body = $elm.querySelector('.article-section__body');
    this.setInitialState($elm, this.$headerLink, this.$body);

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
    if ($elm.dataset.initialState === 'closed') {
      $headerLink.classList.add('article-section__header_link--closed');
      $body.classList.add('visuallyhidden');
    } else {
      // Defensive: remove classes if they turn up here when they shouldn't
      $headerLink.classList.remove('article-section__header_link--closed');
      $body.classList.remove('visuallyhidden');
    }

  }

  toggleState(e) {
    e.preventDefault();
    this.$headerLink.classList.toggle('article-section__header_link--closed');
    this.$body.classList.toggle('visuallyhidden');
  }

};
