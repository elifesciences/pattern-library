const chai = require('chai');

const expect = chai.expect;

// load in component(s) to be tested
const HiddenUntilChecked = require('../assets/js/components/HiddenUntilChecked');

describe('A textfield hidden until checkbox checked', function () {
  'use strict';

  let $elm;
  let $elmWithInitialValue;
  let $elmWithExistingCheckbox;
  let $checkbox;
  let $checkboxWithInitialValue;
  let $checkboxExisting;

  beforeEach(() =>  {
    $elm = document.getElementById('no-initial-value').querySelector('[data-behaviour="HiddenUntilChecked"]');
    new HiddenUntilChecked($elm);

    $elmWithInitialValue = document.getElementById('with-initial-value').querySelector('[data-behaviour="HiddenUntilChecked"]');
    new HiddenUntilChecked($elmWithInitialValue);

    $elmWithExistingCheckbox = document.getElementById('with-existing-checkbox').querySelector('[data-behaviour="HiddenUntilChecked"]');
    new HiddenUntilChecked($elmWithExistingCheckbox);

    $checkbox = document.getElementById('no-initial-value').querySelector('input[type="checkbox"]');
    $checkboxWithInitialValue = document.getElementById('with-initial-value').querySelector('input[type="checkbox"]');
    $checkboxExisting = document.getElementById('checkbox1');
  });

  afterEach(function () {
    [].forEach.call(document.querySelectorAll('.hidden_until_checked__checkbox'), $item => {
      $item.remove();
    });
  });

  it('is hidden immediately if no initial value', () => {
    expect($elm.classList.contains('visuallyhidden')).to.be.true;
  });

  it('is shown immediately if has initial value', () => {
    expect($elmWithInitialValue.classList.contains('visuallyhidden')).to.be.false;
  });

  it('is shown when checkbox checked', () => {
    expect($elm.classList.contains('visuallyhidden')).to.be.true;
    $checkbox.click();
    expect($elm.classList.contains('visuallyhidden')).to.be.false;
    $checkbox.click();
    expect($elm.classList.contains('visuallyhidden')).to.be.true;
  });

  it('value is cleared when checkbox unchecked', () => {
    const input = $elmWithInitialValue.querySelector('input');
    expect(input.value).to.be.equal('value');
    $checkboxWithInitialValue.click();
    expect(input.value).to.be.equal('');
  });

  it('can use an existing checkbox as trigger', () => {
    expect($elmWithExistingCheckbox.classList.contains('visuallyhidden')).to.be.true;
    $checkboxExisting.click();
    expect($elmWithExistingCheckbox.classList.contains('visuallyhidden')).to.be.false;
    $checkboxExisting.click();
    expect($elmWithExistingCheckbox.classList.contains('visuallyhidden')).to.be.true;
  });

});
