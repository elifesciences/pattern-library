'use strict';

const utils = require('../libs/elife-utils')();
module.exports = class HiddenUntilChecked {

  constructor($elm) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;

    const $checkbox = this.buildCheckbox(this.$elm.querySelector('label').textContent);

    this.$elm.parentNode.insertBefore($checkbox, this.$elm);

    const $checkboxInput = $checkbox.querySelector('input');

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

  buildCheckbox(labelText) {
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

    return $label;
  }

};
