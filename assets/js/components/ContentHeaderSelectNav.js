'use strict';

module.exports = class ContentHeaderSelectNav {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.$elm.classList.add('content-header-archive--js');
    this.$form = $elm.querySelector('form');
    this.$form.querySelector('select').addEventListener('change', this.triggerSubmit.bind(this));
  }

  triggerSubmit() {
    this.$form.submit();
  }

};
