'use strict';

module.exports = class Modal {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.modalWindow = this.$elm.querySelector('.modal-container');
    this.$elm.querySelector('.modal-click').addEventListener('click', (event) => this.modalToggle(event));
    this.$elm.querySelector('.modal-content__button').addEventListener('click', (event) => this.modalToggle(event));
    this.window.addEventListener('click', (event) => this.windowOnClick(event));

    this.window.addEventListener('resize', () => {
      this.modalSetup();
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
    if (this.window.innerWidth < 480) {
      this.$elm.classList.remove('modal-nojs');
    } else {
      this.modalWindow.classList.remove('modal-content__show');
      this.$elm.classList.add('modal-nojs');
    }
  }

};
