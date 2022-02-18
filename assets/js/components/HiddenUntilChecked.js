'use strict';

const utils = require('../libs/elife-utils')();
module.exports = class HiddenUntilChecked {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    const $checkboxId = $elm.getAttribute('data-checkbox-id');
    let $checkboxInput;

    if (!$checkboxId || !this.doc.getElementById($checkboxId)) {
      const $checkbox = this.buildCheckbox(this.$elm.querySelector('label').textContent, $checkboxId);
      this.$elm.parentNode.insertBefore($checkbox, this.$elm);
      $checkboxInput = $checkbox.querySelector('input');
    } else {
      $checkboxInput = this.doc.getElementById($checkboxId);
    }

    $checkboxInput.addEventListener('change', e => {
      this.toggleTextField(this.$elm, $checkboxInput, e);
    });

    this.toggleTextField(this.$elm, $checkboxInput);
  }

  toggleTextField(elm, checkbox, event) {
    const text = elm.querySelector('input');
    if ((event === undefined && text.value !== '')) {
      checkbox.setAttribute('checked', 'checked');
    } else if (event !== undefined && event.target.checked) {
      elm.classList.remove('visuallyhidden');
      if (text.value === '') {
        text.focus();
      }
    } else {
      elm.classList.add('visuallyhidden');
      text.value = '';
    }
  }

  buildCheckbox(labelText, id) {
    const $label = utils.buildElement(
      'label',
      ['checkbox__item_label', 'hidden_until_checked__checkbox']
    );
    const $labelText = utils.buildElement(
      'span',
      ['checkbox__item'],
      labelText,
      $label
    );
    const $checkbox = utils.buildElement(
      'input',
      [],
      '',
      $label,
      $labelText
    );

    $checkbox.setAttribute('type', 'checkbox');

    if (id !== undefined) {
      $checkbox.setAttribute('id', id);
    }

    return $label;
  }

};
