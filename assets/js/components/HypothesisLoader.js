'use strict';

module.exports = class HypothesisLoader {

  constructor($elm, _window = window, doc = document) {

    if ($elm.classList.contains('article-section--first')) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.isSingleton = true;

    const $script = this.doc.createElement('script');
    $script.src = 'https://hypothes.is/embed.js';
    $script.id = 'hypothesisEmbedder';
    $script.addEventListener('error', () => {
      this.$elm.dataset.hypothesisEmbedLoadFailed = '';
      this.$elm.dispatchEvent(new this.window.ErrorEvent('Hypothesis embed load failed'));
    });

    this.doc.querySelector('head').appendChild($script);
  }

};
