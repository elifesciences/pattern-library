'use strict';

module.exports = class SearchBox {

  // Injecting window and document to allow easier mocking
  constructor($elm, _window = window, doc = document) {
    try {
      this.$elm = $elm;
      this.$input = this.$elm.querySelector('input[type="search"]');
    } catch (e) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$container = $elm.querySelector('fieldset');
    this.$resetButton = $elm.querySelector('button[type="reset"]');

    this.$elm.classList.add('search-box--js');

    // events
    this.$resetButton.addEventListener('click', this.reset.bind(this));
    this.$input.addEventListener('keyup', this.handleInput.bind(this));
    this.$input.addEventListener('paste', this.handleInput.bind(this));

  }

  /**
   * Handles the reset button being pressed.
   */
  reset() {
    this.hideResetButton();
    if (this.$output) {
      this.$output.innerHTML = '';
    }

    this.$input.focus();
  }

  /**
   * Hides the reset button.
   */
  hideResetButton() {
    this.$resetButton.classList.add('compact-form__reset');
    this.$elm.classList.remove('search-box--populated');
  }

  /**
   * Shows the reset button.
   */
  showResetButton() {
    this.$elm.classList.add('search-box--populated');
    this.$resetButton.classList.remove('compact-form__reset');
  }

  /**
   * Show/hide reset button, depending on whether there's text to clear or not.
   */
  handleInput(e) {
    if (e.keyCode === /*Tab*/9) {
      return;
    }

    if (this.$input.value.length > 0) {
      this.showResetButton();
    } else {
      this.hideResetButton();
    }
  }

};
