'use strict';

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
    this.moveableStage.style.width = (this.slideCount * 100) + 'vw';
    this.setupEventHandlers();
    this.updateControlPanel(this.currentSlide);
    this.togglePlay();

    // TODO: move controls from mustache to js.
  }

  setupProperties() {
    this.moveableStage = this.$elm.querySelector('.carousel__items');
    this.switches = this.$elm.querySelectorAll('.carousel__control--switch');
    this.buttons = {
      previous: this.$elm.querySelector('.carousel__control--previous'),
      next: this.$elm.querySelector('.carousel__control--next'),
      playToggle: this.$elm.querySelector('.carousel__control--toggler')
    };

    // 1-indexed not 0-indexed as will be used as a multiplier
    this.currentSlide = 1;
    this.slideCount = this.moveableStage.querySelectorAll('.carousel-item').length;
  }

  setupEventHandlers() {

    this.window.addEventListener('keydown', this.handleKey.bind(this));

    this.buttons.previous.addEventListener('click', () => {
      this.allTimersStopped = true;
      this.previous();
    });

    this.buttons.next.addEventListener('click', () => {
      this.allTimersStopped = true;
      this.next();
    });

    this.buttons.playToggle.addEventListener('click', this.togglePlay.bind(this));

    this.$elm.querySelector('.carousel__control_switches').addEventListener('click', (e) => {
      this.allTimersStopped = true;
      this.activateSwitch(e);
    });
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
    let timerInterval = 3000;
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
    [].forEach.call(this.switches, (aSwitch, i) => {
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

};
