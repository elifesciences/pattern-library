'use strict';
const clipper = require('text-clipper');

module.exports = class ToggleableCaption {

  constructor($elm, _window = window, doc = document) {
    this.window = _window;
    this.doc = doc;

    this.$elm = $elm;
    if (!($elm instanceof HTMLElement)) {
      return;
    }

    this.$caption = ToggleableCaption.findCaption(this.$elm);
    if (!(this.$caption instanceof HTMLElement)) {
      return;
    }

    this.setupToggle();
  }

  static findCaption($elm) {
    return $elm.querySelector('.caption-text__body');
  }

  setupToggle() {
    const seeMoreButton = '<button class="caption-text__toggle caption-text__toggle--see-more">see more</button>';
    const seeLessButton = '<button class="caption-text__toggle caption-text__toggle--see-less">see less</button>';

    let fullChildren = [];
    this.$caption.childNodes.forEach((child) => fullChildren.push(child.outerHTML));
    fullChildren.push(seeLessButton);

    let truncatedChildren = fullChildren;

    if (truncatedChildren[0].startsWith('<p>')) {
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

    this.toggleCaption();
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

    if (!!this.window.MathJax.Hub) {
      this.window.MathJax.Hub.Queue(['Typeset', this.window.MathJax.Hub, this.$caption]);
    }

    this.$caption.querySelector('.caption-text__toggle').addEventListener('click', this.toggleCaption.bind(this));
  }

};
