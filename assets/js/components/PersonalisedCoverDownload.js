'use strict';

module.exports = class PersonalisedCoverDownload {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;
    this.groups = {};

    this.init();

  }

  init() {
    this.updateButtonAppearance();
    this.introduceCheckbox();
  }

  updateButtonAppearance () {
    let buttons = this.$elm.querySelectorAll('.button');
    [].forEach.call(buttons, (button) => {
      let group = button.text.match(/\(([^)]+)\)/)[1];
      let buttonClass = 'personalised__button--' + group.toLowerCase().replace(/\s+/g, '');
      button.classList.add(buttonClass);
      this.groups[buttonClass] = group;
    });
  }

  introduceCheckbox () {
    if (Object.keys(this.groups).length === 2) {
      this.toggleButtons();
      const checkbox = this.createCheckbox();
      checkbox.addEventListener('change', (event) => {
        this.toggleButtons(event.target.checked);
      });
    }
  }

  toggleButtons(state = false) {
    let hideClass;
    let showClass;
    if (state) {
      hideClass = Object.keys(this.groups)[0];
      showClass = Object.keys(this.groups)[1];
    } else {
      hideClass = Object.keys(this.groups)[1];
      showClass = Object.keys(this.groups)[0];
    }

    let hideButtons = this.$elm.querySelectorAll('.' + hideClass);
    [].forEach.call(hideButtons, (button) => {
      button.parentNode.classList.add('visuallyhidden');
    });
    let showButtons = this.$elm.querySelectorAll('.' + showClass);
    [].forEach.call(showButtons, (button) => {
      button.parentNode.classList.remove('visuallyhidden');
    });
  }

  createCheckbox() {
    let label1 = this.groups[Object.keys(this.groups)[0]];
    let label2 = this.groups[Object.keys(this.groups)[1]];
    let $formItemCheckbox = this.doc.createElement('div');
    $formItemCheckbox.setAttribute('class', 'form-item form-item__checkbox');
    $formItemCheckbox.innerHTML = `
    <div for="letter-style" class="checkbox__label selected-model" aria-label="${label1}">${label1}</div>

    <label class="form-item__label toggle-checkbox">
      <input type="checkbox" id="letter-style" class="type-of-model">
      <span class="toggle-checkbox__slider round"></span>
    </label>

    <div for="letter-style" class="checkbox__label" aria-label="${label2}">${label2}</div>
    `;
    this.$elm.prepend($formItemCheckbox);
    return $formItemCheckbox.querySelector('input');
  }

};
