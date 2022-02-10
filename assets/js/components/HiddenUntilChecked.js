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
    const $textInput = this.$elm.querySelector('input');

    $checkboxInput.addEventListener('change', e => {
      if (e.target.checked) {
        this.$elm.classList.remove('visuallyhidden');
        $textInput.focus();
      } else {
        this.$elm.classList.add('visuallyhidden');
        $textInput.value = '';
      }
    });

    this.$elm.classList.add('visuallyhidden');
  }

  buildCheckbox(labelText) {
    const $label = utils.buildElement(
      'label',
      ['checkbox__item_label']
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
