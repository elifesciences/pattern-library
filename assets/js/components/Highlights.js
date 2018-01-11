'use strict';
var utils = require('../libs/elife-utils')();

module.exports = class Highlights {

  constructor($elm, _window = window, doc = document) {

    if (!($elm instanceof HTMLElement)) {
      return;
    }

    this.window = _window;
    this.$elm = $elm;
    this.doc = doc;
    this.tabletWidth = 900;
    this.desktopWidth = 1200;
    this.setCurrentSlide(1);
    this.timerInterval = 10000;
    this.$prevBtn = $elm.querySelector('.highlights__control--prev');
    this.$nextBtn = $elm.querySelector('.highlights__control--next');
    this.$prevBtn.addEventListener('click', this.previousButton.bind(this));
    this.$nextBtn.addEventListener('click', this.nextButton.bind(this));
    this.moveableStage = this.$elm.querySelector('.listing-list--highlights');
    this.originalSlideWrappers = this.moveableStage.querySelectorAll('.listing-list__item');
    this.numSlides = this.originalSlideWrappers.length;
    this.switchBreakpoint();
    this.window.addEventListener('resize', utils.debounce(() => this.switchBreakpoint(), 150));
    this.margin = this.calculateMargin() * 2;

    this.$elm.addEventListener('keyup', this.checkTabPress.bind(this));
  }

  calculateMargin() {
    const element = this.originalSlideWrappers[0];
    const style = element.currentStyle || window.getComputedStyle(element);

    return parseInt(style.marginLeft, 10);
  }

  setCurrentSlide(num) {
    this.currentSlide = num > this.maxOffset ? this.maxOffset : num;
  }

  checkTabPress(e) {

    // Key code 9 is tab key.
    if (e && e.keyCode === 9) {

      // Closest list item.
      const parentNode = utils.closest(document.activeElement, '.listing-list__item');

      // If we found that list item
      if (parentNode) {

        // The current slide is the nth list item (-1) taking into account the a tag at the top.
        this.setCurrentSlide(
            utils.getOrdinalAmongstSiblingElements(
                parentNode
            ) - 1
        );

        // Render the view again.
        this.renderCurrent();
      }

    }

  }

  isFirstSlide() {
    return this.currentSlide === 1;
  }

  isLastSlide() {
    return this.currentSlide === this.maxOffset;
  }

  previousButton(e) {
    e.preventDefault();

    // Nope out early.
    if (this.isFirstSlide()) {
      return null;
    }

    this.setCurrentSlide(this.currentSlide - 1);
    this.renderCurrent();
  }

  nextButton(e) {
    e.preventDefault();

    // Nope out early.
    if (this.isLastSlide()) {
      return null;
    }

    this.setCurrentSlide(this.currentSlide + 1);
    this.renderCurrent();
  }

  viewportNoWiderThan(thresholdInPx) {
    return this.window.matchMedia('(max-width: ' + thresholdInPx + 'px)').matches;
  }

  onMobile() {
    return this.viewportNoWiderThan(this.tabletWidth);
  }

  onTabletOrMobile() {
    return this.viewportNoWiderThan(this.desktopWidth);
  }

  switchBreakpoint() {
    if (this.onMobile()) {
      this.inView = 1;
    } else if (this.onTabletOrMobile()) {
      this.inView = 2;
    } else {
      this.inView = 3;
    }

    // Which page is the last page?
    this.maxOffset = this.numSlides - (this.inView - 1);

    // Recalculate margin.
    this.margin = this.calculateMargin() * 2;

    // Update some things.
    this.carouselWidth = window.getComputedStyle(this.$elm).width.match(/([0-9\.]+)px/)[1];
    this.setCurrentSlide(this.currentSlide);

    // Render view.
    this.renderCurrent();

  }

  renderCurrent() {
    this.render(
        this.$elm,
        this.$nextBtn,
        this.$prevBtn,
        this.currentSlide,
        this.carouselWidth,
        this.inView
    );
  }

  render($el, $nextButton, $prevButton, thisSlide, carouselWidth, inView) {
    if (this.isFirstSlide()) {
      $prevButton.classList.add('hidden');
    } else {
      $prevButton.classList.remove('hidden');
    }

    if (this.isLastSlide()) {
      $nextButton.classList.add('hidden');
    } else {
      $nextButton.classList.remove('hidden');
    }

    const numOfMargins = inView - 1;
    const totalMargins = numOfMargins * this.margin;

    // Slide width = Carousel width - margins / number in view
    const slideWidth = (carouselWidth - totalMargins) / inView;

    // Slide offset = Slide width plus margin
    const slideOffset = slideWidth + this.margin;

    // Negative offset of 'x' slide offsets
    const nudge = slideOffset * (thisSlide - 1) * -1;

    // Transform
    utils.updateElementTranslate(this.moveableStage, [nudge, 0]);

    // Reset any scroll lefts
    $el.scrollLeft = 0;
  }

};
