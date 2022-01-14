'use strict';

window.addEventListener('resize', function () {
  if (window.innerWidth < 480) {
    console.log('test');

    const modalWindow = document.querySelector('.modal-container');
    const modalBtnClick = document.querySelector('.modal-click');
    const modalButtonClose = document.querySelector('.modal-content__button');

    function modalToggle() {
      modalWindow.classList.toggle('modal-content__show');
    }

    function windowOnClick(event) {
      if (event.target === modalWindow) {
        modalToggle();
      }
    }

    if (document.querySelector('.modal-container')) {
      modalBtnClick.addEventListener('click', modalToggle);
      modalButtonClose.addEventListener('click', modalToggle);
      window.addEventListener('click', windowOnClick);
    }

  }
});
