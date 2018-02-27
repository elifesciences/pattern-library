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
    $script.src = HypothesisLoader.setScriptSource(this.$elm);
    $script.id = 'hypothesisEmbedder';
    $script.addEventListener('error', this.handleError);

    this.doc.querySelector('head').appendChild($script);
  }

  static setScriptSource($elm) {
    return $elm.dataset.endpoint || 'https://hypothes.is/embed.js';
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
