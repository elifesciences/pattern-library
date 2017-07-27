'use strict';
const clipper = require('text-clipper');
const utils = require('../libs/elife-utils')();

module.exports = class ToggleableCaption {

  constructor($elm, _window = window, doc = document) {
    this.window = _window;
    this.doc = doc;
    this.thresholdWidth = $elm.dataset.thresholdWidth;

    this.$elm = $elm;
    if (!($elm instanceof HTMLElement)) {
      return;
    }

    this.$caption = this.$elm.querySelector(this.$elm.getAttribute('data-selector'));
    if (!(this.$caption instanceof HTMLElement)) {
      return;
    }

    this.setupToggle();

    if (!this.truncatedHtml) {
      return;
    }

    if (this.thresholdWidth !== null) {
      this.toggleToggle();
      this.window.addEventListener('resize', utils.debounce(() => this.toggleToggle(), 150));
    } else {
      this.toggleCaption();
    }
  }

  setupToggle() {
    const seeMoreButton = '<button class="caption-text__toggle caption-text__toggle--see-more">see more</button>';
    const seeLessButton = '<button class="caption-text__toggle caption-text__toggle--see-less">see less</button>';

    let fullChildren = [];
    [].forEach.call(this.$caption.childNodes, (child) => fullChildren.push(child.outerHTML));
    fullChildren = fullChildren.filter((child) => child);

    this.originalHtml = fullChildren.join(' ');

    fullChildren.push(seeLessButton);

    let truncatedChildren = fullChildren;

    if (truncatedChildren[0].indexOf('<p>') === 0) {
      const truncatedChild = clipper(truncatedChildren[0], 200, {
        html: true,
        maxLines: 1,
      });

      if (truncatedChild !== truncatedChildren[0] || truncatedChildren.length > 3) {
        truncatedChildren = [truncatedChild.replace(/<\/p>/, ` ${seeMoreButton}</p>`)];
      } else {
        return;
      }
    } else {
      truncatedChildren = [seeMoreButton];
    }

    this.fullHtml = fullChildren.join(' ');
    this.truncatedHtml = truncatedChildren.join(' ');
  }

  toggleCaption() {
    const $toggle = this.$caption.querySelector('.caption-text__toggle');

    this.$caption.innerHTML = '';

    if (!$toggle || $toggle.classList.contains('caption-text__toggle--see-less')) {
      this.$caption.innerHTML = this.truncatedHtml;
      if (this.$caption.getBoundingClientRect().top < 0) {
        this.$caption.scrollIntoView();
      }
    } else {
      this.$caption.innerHTML = this.fullHtml;
    }

    if (!!this.window.MathJax && !!this.window.MathJax.Hub) {
      this.window.MathJax.Hub.Queue(['Typeset', this.window.MathJax.Hub, this.$caption]);
    }

    this.$caption.querySelector('.caption-text__toggle').addEventListener('click', this.toggleCaption.bind(this));
  }

  toggleToggle() {
    if (this.window.matchMedia(`(min-width: ${this.thresholdWidth}px)`).matches) {
      this.removeToggle();
    } else {
      this.restoreToggle();
    }
  }

  removeToggle() {
    const $toggle = this.$caption.querySelector('.caption-text__toggle');

    if ($toggle) {
      this.$caption.innerHTML = this.originalHtml;
    }
  }

  restoreToggle() {
    const $toggle = this.$caption.querySelector('.caption-text__toggle');

    if (!$toggle) {
      this.toggleCaption();
    }
  }

};
