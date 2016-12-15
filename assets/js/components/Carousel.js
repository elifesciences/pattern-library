'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class Carousel {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;

    this.setupProperties();
    if (this.slideCount < 2) {
      return;
    }

    this.$elm.appendChild(this.buildControls());
    this.updateWidth();
    this.updateControlPanel(this.currentSlide);
    this.togglePlay();
    this.window.addEventListener('resize', this.updateWidth.bind(this));
  }

  setupProperties() {
    this.moveableStage = this.$elm.querySelector('.carousel__items');

    // 1-indexed not 0-indexed as will be used as a multiplier
    this.currentSlide = 1;
    this.originalSlideWrappers = this.moveableStage.querySelectorAll('.carousel__item_wrapper');
    this.slideCount = this.originalSlideWrappers.length;
    this.timerInterval = 10000;
  }

  buildControls() {
    let $previousWrapper = this.buildControl$traverser('previous');
    let $nextWrapper = this.buildControl$traverser('next');
    let $visibleControlsWrapper = utils.buildElement('div', ['carousel__control_panel__visible']);

    this.buttons = {
      playToggle: this.buildControl$toggle(),
      previous: $previousWrapper.querySelector('button'),
      next: $nextWrapper.querySelector('button')
    };
    this.switches = this.buildControl$switches(this.slideCount);

    let visibleControls = [$previousWrapper, this.switches, $nextWrapper];
    visibleControls.forEach(function (control) {
      $visibleControlsWrapper.appendChild(control);
    });

    let $controlPanel = utils.buildElement('div', ['carousel__control_panel']);
    $controlPanel.appendChild(this.buttons.playToggle);
    $controlPanel.appendChild($visibleControlsWrapper);

    this.setupEventListeners();
    return $controlPanel;
  }

  buildControl$traverser(direction) {
    if (direction !== 'previous' && direction !== 'next') {
      return;
    }

    let _direction = direction === 'previous' ? 'previous' : 'next';
    let text = direction + ' item';

    let $div = utils.buildElement('div', ['carousel__control_wrapper']);

    let $button = utils.buildElement('button',
                                     [
                                       'carousel__control--traverse',
                                       'carousel__control--' + _direction
                                     ],
                                     '',
                                     $div);

    utils.buildElement('span', ['visuallyhidden'], text, $button);
    return $div;
  }

  buildControl$toggle() {

    let buttonId = 'carouselToggle';
    let $button = utils.buildElement('button', ['carousel__control--toggler'], 'Play');
    $button.id = buttonId;

    let labelText = 'Toggle the auto refresh of the carousel on and off (the carousel is set to ';
    labelText += 'refresh every ' + (this.timerInterval/1000) + ' seconds while it is playing).';
    let $label = utils.buildElement('label', [], labelText);
    $label.setAttribute('for', buttonId);

    let $toggle = utils.buildElement('div', ['carousel__control_toggle', 'visuallyhidden']);
    $toggle.appendChild($label);
    $toggle.appendChild($button);
    return $toggle;
  }

  buildControl$switch(text) {
    let $li = utils.buildElement('li', ['carousel__control--switch-item']);
    let $button =  utils.buildElement('button', ['carousel__control--switch'], '', $li);
    utils.buildElement('span', ['visuallyhidden'], '' + text, $button);
    return $li;
  }

  buildControl$switches(count) {
    let $ol = utils.buildElement('ol', ['carousel__control_switches']);
    for (let i = 1; i <= count; i += 1) {
      $ol.appendChild(this.buildControl$switch(i));
    }

    return $ol;
  }

  userInitiatedProgression(callback) {
    this.timerStopped = true;
    if (!!callback && typeof callback === 'function') {
      callback.call(this, true);
    }
  }

  setupEventListeners() {
    this.buttons.playToggle.addEventListener('click', this.togglePlay.bind(this));

    this.buttons.previous.addEventListener('click', () => {
      this.userInitiatedProgression(this.previous);
    });

    this.switches.addEventListener('click', this.activateSwitch.bind(this));

    this.buttons.next.addEventListener('click', () => {
      this.userInitiatedProgression(this.next);
    });

    this.window.addEventListener('keydown', this.handleKey.bind(this));
  }

  updateWidth(stageExtended) {
    if (!stageExtended) {
      this.moveableStage.style.width = (this.$elm.width * this.slideCount) + 'px';
      return;
    }

    // increment width to accommodate more slides
    let currentWidthString = this.window.getComputedStyle(this.$elm).width;
    let currentWidth = currentWidthString.match(/([0-9]+)px/)[1];
    let increment = currentWidth * this.slideCount;
    this.moveableStage.style.width = currentWidth + increment + 'px';
  }

  updateControlPanel(currentSlide) {
    this.hideInvalidButtonChoice(currentSlide);
    this.updateActiveSwitch(currentSlide);
  }

  hideInvalidButtonChoice(currentSlide) {
    if (currentSlide === 1) {
      this.buttons.previous.classList.add('hidden');
      // this.buttons.next.classList.remove('hidden');
    } else {
      this.buttons.previous.classList.remove('hidden');
    }

/*
    if (currentSlide === this.slideCount) {
      this.buttons.previous.classList.remove('hidden');
      this.buttons.next.classList.add('hidden');
    }

    if (currentSlide > 1 && currentSlide < this.slideCount) {
      this.buttons.previous.classList.remove('hidden');
      this.buttons.next.classList.remove('hidden');
    }
*/
  }

  updateActiveSwitch(currentSlide) {
    [].forEach.call(this.switches.querySelectorAll('.carousel__control--switch'), (aSwitch, i) => {
      if (i === currentSlide - 1) {
        aSwitch.classList.add('active');
      } else {
        aSwitch.classList.remove('active');
      }
    });
  }

  togglePlay() {
    let toggleButton = this.buttons.playToggle.querySelector('button');
    let currentButtonState = toggleButton.innerHTML;
    if (currentButtonState === 'Pause') {
      toggleButton.innerHTML = 'Play';
      this.timerStopped = true;
      this.window.clearInterval(this.timer);
    } else {
      toggleButton.innerHTML = 'Pause';
      this.timerStopped = false;
      this.setupTimer();
    }
  }

  next(userInitiated) {
    if (this.currentSlide % this.slideCount === 0/* && !userInitiated*/) {
      this.extendStage();
    }
    // if (this.currentSlide < this.slideCount || !userInitiated) {
    this.updateSlide();
    this.updateControlPanel(this.currentSlide);
    // }
  }

  previous() {
    if (this.currentSlide > 1) {
      this.updateSlide('previous');
      this.updateControlPanel(this.currentSlide);
    }
  }

  getCurrentOffset() {
    let offsetStringMatch = this.moveableStage.style.transform.match(/translate\((.*)px,[^)]+\)/);
    if (!offsetStringMatch) {
      return 0;
    }

    return this.window.parseInt(offsetStringMatch[1], 10);
  }

  updateSlide(direction) {
    let currentOffset = this.getCurrentOffset();
    let newOffset;
    let currentWidthStringMatch = this.window.getComputedStyle(this.$elm).width
                                                                         .match(/^([0-9]+)px/);
    let currentCarouselWidth = this.window.parseInt(currentWidthStringMatch[1], 10);
    if (direction === 'previous') {
      this.currentSlide -= 1;
      newOffset = currentOffset + currentCarouselWidth;
    } else {
      this.currentSlide += 1;
      newOffset = currentOffset - currentCarouselWidth;
    }

    utils.updateElementTranslate(this.moveableStage, [newOffset + 'px', 0]);
  }

  setupTimer() {
    this.timerStopped = false;
    this.timer = this.startNewAdvancementTimer(this.timerInterval);

    // mousing over the carousel cancels the timer
    this.$elm.addEventListener('mouseenter', () => {
      if (!this.timerStopped) {
        this.window.clearInterval(this.timer);
      }
    });

    // mouse out from the carousel resets the timer
    this.$elm.addEventListener('mouseleave', () => {
      if (!this.timerStopped) {
        this.timer = this.startNewAdvancementTimer(this.timerInterval);
      }
    });
  }

  startNewAdvancementTimer(intervalInMs) {
    return this.window.setInterval(() => {
      if (!this.timerStopped) {
        this.next();
      }
    }, intervalInMs);
  }

  handleKey(e) {
    let code = e.keyCode || e.charCode;
    if (code === 37 || code === 39) {
      this.timerStopped = true;
      if (code === 37) {
        this.userInitiatedProgression(this.previous);
      } else {
        this.userInitiatedProgression(this.next);
      }
    }
  }

  activateSwitch(e) {
    let activatedSwitch = e.target;
    let activatedSlide = this.window.parseInt(activatedSwitch.querySelector('span').innerHTML, 10);
    if (activatedSlide === this.currentSlide) {
      return;
    }

    let slideOffSet = activatedSlide - this.currentSlide;
    let slideOffSetAbs = Math.abs(slideOffSet);
    let callback = slideOffSet < 0 ? this.previous : this.next;

    for (let i = 0; i < slideOffSetAbs; i += 1) {
      this.userInitiatedProgression(callback);
    }
  }

  extendStage () {
    this.updateWidth(true);
    [].forEach.call(this.originalSlideWrappers, (slide) => {
      this.moveableStage.appendChild(slide.cloneNode(true));
    })
  }

};
