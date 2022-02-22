'use strict';

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
      this.modalWindow.classList.remove('modal-content__show');
    });

    this.modalSetup();
  }

  modalToggle(event) {
    this.modalWindow.classList.toggle('modal-content__show');
    event.preventDefault();
  }

  windowOnClick(event) {
    if (event.target === this.modalWindow) {
      this.modalToggle(event);
    }
  }

  modalSetup() {
    this.$elm.classList.remove('modal-nojs');
  }

};
