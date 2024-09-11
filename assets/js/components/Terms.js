'use strict';

module.exports = class Terms {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.termsOn();
  }

  termsOn() {
    const assessment = document.querySelector('.assessment');
    const button = document.querySelector('.terms-toggle-button');

    button.addEventListener('click', () => {
      this.$elm.getAttribute('aria-expanded')
      if (setAttribute('aria-expanded', 'false') ='true') {
        this.$elm.setAttribute('aria-expanded', 'false')
      } else {
        this.$elm.setAttribute('aria-expanded', 'true')
      }
      assessment.classList.toggle('assessment-expanded');
    });
  }
};
