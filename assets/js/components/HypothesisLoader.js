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

    const $script = this.doc.createElement('script');
    $script.src = 'https://hypothes.is/embed.js';
    $script.id = 'hypothesisEmbedder';
    $script.addEventListener('error', (e) => {
      this.$elm.dataset.hypothesisEmbedLoadStatus = 'failed';
      this.$elm.dispatchEvent(new this.window.ErrorEvent('Hypothesis embed load failed'));
      console.error('Hypothesis client load failed. The error is: ', e);
    });

    this.doc.querySelector('head').appendChild($script);
  }

};
