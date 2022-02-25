const chai = require('chai');

const expect = chai.expect;

// load in component(s) to be tested
const ModalWindow = require('../assets/js/components/Modal');

describe('modal window', () => {
  'use strict';

  let $elm;
  let $elmWithTriggerId;
  let $elmTrigger;
  let $elmWithTriggerIdTrigger;

  beforeEach(() => {
    $elm = document.getElementById('without-trigger-id').querySelector('[data-behaviour="Modal"]');
    new ModalWindow($elm);

    $elmWithTriggerId = document.getElementById('with-trigger-id').querySelector('[data-behaviour="Modal"]');
    new ModalWindow($elmWithTriggerId);

    $elmTrigger = document.getElementById('without-trigger-id').querySelector('.modal-click');
    $elmWithTriggerIdTrigger = document.getElementById('trigger-id');
  });

  afterEach(() => {
    $elm.querySelector('.modal-container').classList.remove('modal-content__show');
    $elmWithTriggerId.querySelector('.modal-container').classList.remove('modal-content__show');
    $elm.classList.add('modal-nojs');
    $elmWithTriggerId.classList.add('modal-nojs');
  });

  it('is initially hidden', () => {
    expect($elm.classList.contains('modal-content__show')).to.be.false;
    expect($elmWithTriggerId.classList.contains('modal-content__show')).to.be.false;
  });

  it('opens when modal trigger is clicked', () => {
    $elmTrigger.click();
    expect($elm.querySelector('.modal-container').classList.classList.contains('modal-content__show')).to.be.true;
  });

  it('opens when custom trigger is clicked', () => {
    $elmWithTriggerIdTrigger.click();
    expect($elmWithTriggerId.querySelector('.modal-container').classList.classList.contains('modal-content__show')).to.be.true;
  });

});
