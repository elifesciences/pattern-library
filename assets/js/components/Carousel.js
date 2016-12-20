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

    this.moveableStage = this.$elm.querySelector('.carousel__items');
    this.originalSlideWrappers = this.moveableStage.querySelectorAll('.carousel__item_wrapper');
    this.originalSlideCount = this.originalSlideWrappers.length;
    this.currentSlideCount = this.originalSlideCount;

    if (this.originalSlideCount < 2) {
      return;
    }

    this.init();

  }

  init() {
    this.currentSlide = 1;
    this.timerInterval = 10000;

    this.$elm.querySelector('.carousel__heading').classList.add('visuallyhidden');
    this.$elm.appendChild(this.buildVisibleControls());
    this.$toggler = this.buildControl$toggle();
    this.$elm.insertBefore(this.$toggler, this.$elm.querySelector('.carousel__items'));
    this.updateWidth();
    this.updateControlPanel(this.currentSlide);
    this.togglePlay(this.$toggler);
    this.$toggler.focus();

    this.window.addEventListener('keydown', this.handleKey.bind(this));
    this.window.addEventListener('blur', this.cancelTimer.bind(this));
    this.window.addEventListener('focus', this.setupTimer.bind(this));
    this.window.addEventListener('resize', () => {
      this.updateWidth();
      this.adjustTranslateForResize();
    });
    this.makeSingleSlideATVisible(this.currentSlide);
  }

  // TODO: To fix the focus problem:
  // - assign all slides and all elements within every slide a tab index of -1
  // DONE
  // TODO: Does this need aria-hidden too?

  // TODO: THESE BITS
  // - for the newly active slide, remove the tab index -1 on the child elements & focus to that slide
  // - for the newly inactive slide, restore the negative tabindex value again

  atHide($node) {
    $node.setAttribute('tabindex', -1);
    $node.setAttribute('aria-hidden', true);
  }

  atShow($node) {
    $node.removeAttribute('tabindex', -1);
    $node.removeAttribute('aria-hidden', true);
  }

  setATVisibility($root, show) {
    let action;
    if (show) {
      action = this.atShow;
    } else {
      action = this.atHide;
    }

    action.call(this, $root);
    [].forEach.call($root.childNodes, ($descendant) => {
      if ($descendant.nodeType === $descendant.ELEMENT_NODE) {
        action.call(this, $descendant);
        if ($descendant.hasChildNodes())  {
          this.setATVisibility($descendant, show);
        }
      }
    });
  }

  makeSingleSlideATVisible(slideNumber) {
    [].forEach.call(this.moveableStage.querySelectorAll('.carousel__item_wrapper'), ($el) => {
      this.setATVisibility($el, false);
    });
    let _slideNumber = slideNumber || 1;
    let slide = this.$elm.querySelectorAll('.carousel-item')[_slideNumber -1];
    this.setATVisibility(slide, true);
    slide.focus();
  }

  /**
   * Builds and returns all controls for the carousel
   *
   * @returns {Element} The control panel
   */
  buildVisibleControls() {
    // Btn wrappers needed to reserve space in case buttons are removed, to stop things moving about
    let $previousWrapper = this.buildControl$traverser('previous');
    let $nextWrapper = this.buildControl$traverser('next');

    this.buttons = {
      previous: $previousWrapper.querySelector('button'),
      next: $nextWrapper.querySelector('button')
    };

    // switches are the circular buttons for depicting/going to a slide
    this.switches = this.buildControl$switches(this.originalSlideCount);

    let $controlPanel = utils.buildElement('div', ['carousel__control_panel']);
    let $visibleControlsWrapper = utils.buildElement('div', ['carousel__control_panel__visible']);
    let visibleControls = [$previousWrapper, this.switches, $nextWrapper];
    visibleControls.forEach(function (control) {
      $visibleControlsWrapper.appendChild(control);
    });

    $controlPanel.appendChild($visibleControlsWrapper);

    return $controlPanel;
  }

  /**
   * Returns a div-wrapped button for a next or previous control, with event listener
   *
   * @param {String} direction 'previous' | 'next'
   * @returns {Element} A div-wrapped button
   */
  buildControl$traverser(direction) {
    let _direction = direction === 'previous' ? 'previous' : 'next';
    let text = direction + ' item';
    let $wrapper = utils.buildElement('div', ['carousel__control_wrapper']);
    let $button = utils.buildElement('button',
                                     [ 'carousel__control',
                                       'carousel__control--traverse',
                                       'carousel__control--' + _direction
                                     ],
                                     '',
                                     $wrapper);
    $button.addEventListener('click', () => {
      this.userInitiatedProgression(this[_direction]);
    });

    utils.buildElement('span', ['visuallyhidden'], text, $button);
    return $wrapper;
  }

  /**
   * Builds and returns a visually hidden play/pause toggle (button & label), with event listener
   *
   * @returns {Element} The toggler
   */
  buildControl$toggle() {
    let $button = utils.buildElement('button', ['carousel__control--toggler', 'visuallyhidden'],
                                     'Play carousel');
    $button.setAttribute('aria-label', 'The carousel is now paused. Play carousel');
    $button.addEventListener('click', () => {
      this.togglePlay($button);
    });
    return $button;
  }

  /**
   * Builds and returns a list of switches, with event listener attached
   *
   * @param quantity The number of switches to build
   * @returns {Element} The list of switches
   */
  buildControl$switches(quantity) {
    let $switches = utils.buildElement('ol', ['carousel__control_switches']);
    for (let i = 1; i <= quantity; i += 1) {
      $switches.appendChild(this.buildControl$switch('Go to item ' + i + ' of ' +
                                                     this.originalSlideCount));
    }

    $switches.addEventListener('click', this.activateSwitch.bind(this));
    return $switches;
  }

  /**
   * Builds and returns a switch
   * @param text The next for the switch (visually hidden)
   * @returns {Element} The switch
   */
  buildControl$switch(text) {
    let $item = utils.buildElement('li', ['carousel__control--switch-item']);
    let $button =  utils.buildElement('button',
                                      [
                                        'carousel__control',
                                        'carousel__control--switch'
                                      ],
                                      '',
                                      $item);
    let $switch = utils.buildElement('span', ['visuallyhidden'], '' + text, $button);
    $switch.setAttribute('aria-label', text);
    return $item;
  }

  /**
   * Toggles the play/pause state of the carousel based on the current value of the toggle button.
   *
   * @param $button The toggler
   */
  togglePlay($button) {
    let currentButtonState = $button.innerHTML;
    if (currentButtonState === 'Pause carousel') {
      $button.innerHTML = 'Play carousel';
      $button.setAttribute('aria-label', 'The carousel is now paused. Play carousel');
      this.timerStopped = true;
      this.cancelTimer();
    } else {
      $button.innerHTML = 'Pause carousel';
      $button.setAttribute('aria-label', 'The carousel is now playing. Pause carousel');
      this.timerStopped = false;
      this.setupTimer();
    }
  }

  cancelTimer() {
    this.window.clearInterval(this.timer);
  }

  setupTimer() {
    // make sure old timer stopped before starting a new one
    this.cancelTimer();

    // Indicates whether timer should run at all on this carousel (hard stop, not pause).
    this.timerStopped = false;
    this.timer = this.startNewAdvancementTimer(this.timerInterval);

    // mousing over the carousel cancels the timer
    this.$elm.addEventListener('mouseenter', this.cancelTimer.bind(this));

    // mouse out from the carousel resets the timer
    this.$elm.addEventListener('mouseleave', () => {
      this.cancelTimer();
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
    if (code === 37/*left arrow*/ || code === 39/*right arrow*/) {
      this.timerStopped = true;
      if (code === 37) {
        this.userInitiatedProgression(this.previous);
      } else {
        this.userInitiatedProgression(this.next);
      }
    }
  }

  userInitiatedProgression(callback) {
    // Any user-activation of a control permanently stops the timer
    this.timerStopped = true;
    if (!!callback && typeof callback === 'function') {
      callback.call(this, true);
    }
  }

  next() {
    if (this.currentSlide % this.originalSlideCount === 0) {
      this.extendStage();
    }

    this.updateSlide();
    this.updateControlPanel(this.currentSlide);
  }

  previous() {
    if (this.currentSlide > 1) {
      this.updateSlide('previous');
      this.updateControlPanel(this.currentSlide);
    }
  }

  extendStage () {
    // Make room for another slide set
    this.currentSlideCount += this.originalSlideCount;
    this.updateWidth();

    // Clone in the new slide set
    [].forEach.call(this.originalSlideWrappers, (slide) => {
      this.moveableStage.appendChild(slide.cloneNode(true));
    });
  }

  /**
   * Translates moveableStage 1 slide's width in the appropriate direction
   * @param {String} direction 'next' | 'previous' Direction to move
   */
  updateSlide(direction) {
    let currentOffset = this.getCurrentOffset();
    let currentWidthStringMatch = this.window.getComputedStyle(this.$elm).width
                                      .match(/^([0-9]+)px/);
    let currentCarouselWidth = this.window.parseInt(currentWidthStringMatch[1], 10);
    let newOffset;
    if (direction === 'previous') {
      this.currentSlide -= 1;
      newOffset = currentOffset + currentCarouselWidth;
    } else {
      this.currentSlide += 1;
      newOffset = currentOffset - currentCarouselWidth;
    }

    utils.updateElementTranslate(this.moveableStage, [newOffset + 'px', 0]);
  }

  /**
   * Returns the current numerical value of moveableStage's X translation in px
   *
   * @returns {number} Numerical value of the X translation of moveableStage
   */
  getCurrentOffset() {
    let offsetStringMatch = this.moveableStage.style.transform.match(/translate\((.*)px,[^)]+\)/);
    if (!offsetStringMatch) {
      return 0;
    }

    return this.window.parseInt(offsetStringMatch[1], 10);
  }

  updateControlPanel(currentSlide) {
    this.hideInvalidButtonChoice(currentSlide);
    this.updateActiveSwitch(currentSlide);
  }

  /**
   * Hides previous button if on first slide.
   *
   * @param {number} currentSlide The number of the current slide
   */
  hideInvalidButtonChoice(currentSlide) {
    this.buttons.previous.classList.remove('hidden');
    this.buttons.next.classList.remove('hidden');
    let logicalSlideNumber = this.getLogicalSlideNumber(currentSlide);
    if (logicalSlideNumber === 1) {
      this.buttons.previous.classList.add('hidden');
    } else if (logicalSlideNumber === this.originalSlideCount) {
      this.buttons.next.classList.add('hidden');
    }
  }

  /**
   * Activate the switch indicating the current logical slide
   *
   * @param {number} currentSlide The number of the current slide
   */
  updateActiveSwitch(currentSlide) {
    let currentLogicalSlide = this.getLogicalSlideNumber(currentSlide);
    [].forEach.call(this.switches.querySelectorAll('.carousel__control--switch'), (aSwitch, i) => {
      if (i === currentLogicalSlide - 1) {
        aSwitch.classList.add('active');
      } else {
        aSwitch.classList.remove('active');
      }
    });
  }

  /**
   * Returns the number of the side within its set.
   *
   * E.g. where there's 3 slides in a set, and the actualSlideNumber is 8, this indicates that it's
   * the 2nd slide in the 3rd slide set, so its logical number is 2.
   * (A slide set is a clone of the starting slides to facilitate perpetual scroll.)
   *
   * @param {number} actualSlideNumber Number of the slide to evaluate
   * @returns {number}
   */
  getLogicalSlideNumber(actualSlideNumber) {
    let setSize = this.originalSlideCount;
    let slideSetOfSlide = Math.ceil(actualSlideNumber / setSize);
    let firstSlideOfSet = setSize *  slideSetOfSlide - (setSize - 1);
    return actualSlideNumber - firstSlideOfSet + 1;
  }

  /**
   * Move to the closest slide with the same logical number as the activated switch
   *
   * @param {Event} e The event
   */
  activateSwitch(e) {
    let logicalSlideRequested = this.window.parseInt(e.target.querySelector('span').innerHTML, 10);
    let logicalSlideCurrent = this.getLogicalSlideNumber(this.currentSlide);
    let slideOffset = logicalSlideRequested - logicalSlideCurrent;

    if (logicalSlideRequested === logicalSlideCurrent) {
      return;
    }

    let callback = slideOffset < 0 ? this.previous : this.next;

    for (let i = 0; i < Math.abs(slideOffset); i += 1) {
      this.userInitiatedProgression(callback);
    }
  }

  adjustTranslateForResize() {
    let carouselWidth = window.getComputedStyle(this.$elm).width.match(/([0-9]+)px/)[1];
    let currentSlide = this.currentSlide;
    let expectedOffset = (currentSlide - 1) * carouselWidth * -1;
    this.moveableStage.style.transform = 'translate(' + expectedOffset + 'px, 0)';
  }

  updateWidth() {
    this.moveableStage.style.width = utils.adjustPxString(
      this.window.getComputedStyle(this.$elm).width,
      this.currentSlideCount,
      'multiply');
  }

};
