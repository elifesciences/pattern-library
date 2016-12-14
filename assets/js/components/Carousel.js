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
    this.moveableStage.style.width = (this.slideCount * 100) + 'vw';
    this.updateControlPanel(this.currentSlide);
    this.togglePlay();
  }

  setupProperties() {
    this.moveableStage = this.$elm.querySelector('.carousel__items');

    // 1-indexed not 0-indexed as will be used as a multiplier
    this.currentSlide = 1;
    this.slideCount = this.moveableStage.querySelectorAll('.carousel-item').length;

    this.window.addEventListener('keydown', this.handleKey.bind(this));
  }

  updateControlPanel(currentSlide) {
    this.hideInvalidButtonChoice(currentSlide);
    this.updateActiveSwitch(currentSlide);
  }

  togglePlay() {
    let currentButtonState = this.buttons.playToggle.innerHTML;
    let isPlaying = (currentButtonState === 'Pause');
    if (isPlaying) {
      this.buttons.playToggle.innerHTML = 'Play';
      this.allTimersStopped = true;
      this.window.clearInterval(this.timer);
    } else {
      this.buttons.playToggle.innerHTML = 'Pause';
      this.setupTimer();
    }
  }

  setupTimer() {
    this.allTimersStopped = false;
    let timerInterval = 10000;
    this.timer = this.startNewAdvancementTimer(timerInterval);

    // mousing over the carousel cancels the timer
    this.$elm.addEventListener('mouseenter', () => {
      if (!this.allTimersStopped) {
        this.window.clearInterval(this.timer);
      }
    });

    // mouse out from the carousel resets the timer
    this.$elm.addEventListener('mouseleave', () => {
      if (!this.allTimersStopped) {
        this.timer = this.startNewAdvancementTimer(timerInterval);
      }
    });
  }

  startNewAdvancementTimer(intervalInMs) {
    return this.window.setInterval(() => {
      this.next();
    }, intervalInMs);
  }

  handleKey(e) {
    let code = e.keyCode || e.charCode;
    if (code === 37 || code === 39) {
      this.allTimersStopped = true;
      if (code === 37) {
        this.previous();
      } else {
        this.next();
      }
    }
  }

  next() {
    if (this.currentSlide < this.slideCount) {
      this.updateSlide();
      this.updateControlPanel(this.currentSlide);
    }
  }

  previous() {
    if (this.currentSlide > 1) {
      this.updateSlide('previous');
      this.updateControlPanel(this.currentSlide);
    }

  }

  getCurrentOffset() {
    let offsetStringMatch = this.moveableStage.style.transform.match(/translateX\((.*)vw\)/);
    if (!offsetStringMatch) {
      return 0;
    }

    return this.window.parseInt(offsetStringMatch[1], 10);
  }

  updateSlide(direction) {
    let currentOffset = this.getCurrentOffset();
    let newOffset;

    if (direction === 'previous') {
      this.currentSlide -= 1;
      newOffset = currentOffset + 100;
    } else {
      this.currentSlide += 1;
      newOffset = currentOffset - 100;
    }

    // TODO: Consider updating utils with this forumlation (vw) for translation adjustment
    this.moveableStage.style.transform = 'translateX(' + newOffset + 'vw)';
  }

  hideInvalidButtonChoice(currentSlide) {
    if (currentSlide === 1) {
      this.buttons.previous.classList.add('hidden');
      this.buttons.next.classList.remove('hidden');
    }

    if (currentSlide === this.slideCount) {
      this.buttons.previous.classList.remove('hidden');
      this.buttons.next.classList.add('hidden');
    }

    if (currentSlide > 1 && currentSlide < this.slideCount) {
      this.buttons.previous.classList.remove('hidden');
      this.buttons.next.classList.remove('hidden');
    }
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
      callback.call(this);
    }
  }

  buildControl$toggle() {

    let buttonId = 'carouselToggle';
    let $button = utils.buildElement('button', ['carousel__control--toggler'], 'Play');
    $button.id = buttonId;

    let labelText = 'Toggles the auto refresh of the carousel on and off. The carousel is set to ';
    labelText += 'refresh every 10 seconds while it is playing.';
    let $label = utils.buildElement('label', [], labelText);
    $label.setAttribute('for', buttonId);

    let $toggle = utils.buildElement('div', ['carousel__control_toggle', 'visuallyhidden']);
    $toggle.appendChild($label);
    $toggle.appendChild($button);
    return $toggle;
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

  buildControls() {
    let $controlPanel = utils.buildElement('div', ['carousel__control_panel']);
    let $previousWrapper = this.buildControl$traverser('previous');
    let $nextWrapper = this.buildControl$traverser('next');

    this.buttons = {
      playToggle: this.buildControl$toggle(),
      previous: $previousWrapper.querySelector('button'),
      next: $nextWrapper.querySelector('button')
    };
    this.switches = this.buildControl$switches(this.slideCount);

    let controls = [this.buttons.playToggle, $previousWrapper, this.switches, $nextWrapper];
    controls.forEach(function (control) {
      $controlPanel.appendChild(control);
    });

    this.setupEventListeners();
    return $controlPanel;
  }

  setupEventListeners() {
    this.buttons.playToggle.addEventListener('click', this.togglePlay.bind(this));

    this.buttons.previous.addEventListener('click', () => {
      this.allTimersStopped = true;
      this.previous();
    });

    this.switches.addEventListener('click', (e) => {
      this.allTimersStopped = true;
      this.activateSwitch(e);
    });

    this.buttons.next.addEventListener('click', () => {
      this.allTimersStopped = true;
      this.next();
    });

    this.window.addEventListener('keydown', this.handleKey.bind(this));
  }
};
