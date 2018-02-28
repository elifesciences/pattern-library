'use strict';

module.exports = class HypothesisLoader {

  constructor($elm, _window = window, doc = document) {

    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.isSingleton = true;

    this.$embedder = this.doc.createElement('script');
    this.$embedder.src = 'https://hypothes.is/embed.js';
    this.$embedder.id = 'hypothesisEmbedder';
    this.$embedder.addEventListener('error', this.handleError);

    this.doc.querySelector('head').appendChild(this.$embedder);
  }

  handleError() {
    this.$elm.dataset.hypothesisEmbedLoadStatus = 'failed';
    this.$elm.dispatchEvent(new this.window.ErrorEvent(
      'loaderror',
      {
        message: 'Hypothesis embed load failed'
      }
    ));
  }

};
