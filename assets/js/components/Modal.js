'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class Modal {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    const $triggerId = this.$elm.getAttribute('data-trigger-id');
    let $trigger;

    if (!$triggerId || !this.doc.getElementById($triggerId)) {
      $trigger = this.$elm.querySelector('.modal-click');
    } else {
      $trigger = this.doc.getElementById($triggerId);
    }

    this.modalWindow = this.$elm.querySelector('.modal-container');
    $trigger.addEventListener('click', (event) => this.modalToggle(event));
    this.$elm.querySelector('.modal-content__button').addEventListener('click', (event) => this.modalToggle(event));
    this.window.addEventListener('click', (event) => this.windowOnClick(event));

    this.window.addEventListener('resize', () => {
      if (this.$elm.classList.contains('small-device') && this.window.innerWidth >= 480) {
        this.modalWindow.classList.remove('modal-content__show');
      }
    });

    this.$elm.classList.remove('modal-nojs');
  }

  modalToggle(event) {
    if (!this.$elm.classList.contains('small-device') || this.window.innerWidth < 480) {
      this.modalWindow.classList.toggle('modal-content__show');

      if (!this.modalWindow.classList.contains('modal-content__show')) {
        this.$elm.dispatchEvent(utils.eventCreator('modalWindowClose'));
      }
    }

    event.preventDefault();
  }

  windowOnClick(event) {
    if (event.target === this.modalWindow) {
      this.modalToggle(event);
    }
  }

};
