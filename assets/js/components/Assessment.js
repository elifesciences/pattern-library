'use strict';

module.exports = class Assessment {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.assessmentToggle();
  }

  assessmentToggle() {
    const assessment = this.$elm.querySelector('.assessment__container');
    const button = this.$elm.querySelector('.assessment__toggle-btn');

    button.addEventListener('click', () => {

      if (assessment.getAttribute('aria-expanded') === 'false') {
        assessment.setAttribute('aria-expanded', 'true');
        button.innerHTML = 'See less';
        button.classList.add('assessment__toggle-btn-reverse');
      } else {
        assessment.setAttribute('aria-expanded', 'false');
        button.innerHTML = 'Read more about this assessment';
        button.classList.remove('assessment__toggle-btn-reverse');
      }

      assessment.classList.toggle('assessment-expanded');
    });
  }
};
