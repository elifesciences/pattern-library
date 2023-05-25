'use strict';

module.exports = class TestComponent {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.$elm.addEventListener('click', this.changeText.bind(this));
  }

  changeText() {
    this.$elm.innerHTML = "Clicked!" 
  }
};
