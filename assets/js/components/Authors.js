'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class Authors {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.authorLimits = [3, 10];

    this.authors = $elm.querySelectorAll('.author_list_item');
    this.institutions = $elm.querySelectorAll('.institution_list_item');

    if (this.authors.length > this.authorLimits[0]) {
      this.authors[this.authors.length - 1].classList.add('author_list_item--last');
      this.$elm.classList.add('authors--collapsible');
      this.addTrailingText('author', this.authors);
      this.authorLimits.map(limit => {
        if (limit < this.authors.length) {
          this.$elm.classList.add(`authors--limit-${limit}`);
        }
      });
    }

    if (this.institutions.length > 0) {
      this.institutions[this.institutions.length - 1].classList.add('institution_list_item--last');
    }

    this.hasToggleInstitution = false;
    this.hideAllExcessItems();
    this.setupResizeHandler();
  }

  setupResizeHandler() {
    this.currentClientWidth = document.body.getBoundingClientRect().width;
    this.window.addEventListener('resize', utils.debounce(() => this.handleResize(), 30));
  }

  handleResize() {
    // Android (at least), may fire resize on initial scroll as url bar moves off the top of the
    // screen, and the height of the browser window increases until the top edge is at the top of
    // the screen.
    this.resizedClientWidth = document.body.getBoundingClientRect().width;
    if (this.currentClientWidth === this.resizedClientWidth) {
      return;
    }

    this.currentClientWidth = this.resizedClientWidth;
    if (!this.$elm.querySelector('.author_list--expanded')) {
      this.hideAllExcessItems();
    }

    this.addTrailingText('author', this.authors);

    const toggles = this.$elm.querySelectorAll(
      '.item_toggle .author_link_highlight'
    );
    const updateToggleText = this.getUpdatedToggleText.bind(this);
    [].forEach.call(toggles, ($toggle) => {
      $toggle.innerHTML = updateToggleText();
    });
  }

  /**
   * Determine excess by itemType from items supplied and hides those.
   *
   * @param {string} itemType 'institution'
   * @param {DOMTokenList} items List of items to identify the excess within, and hide those
   */
  hideExcessItems(itemType, items) {
    this.clearExcessMark(items);
    this.markAsExcess(this.getExcessItems(itemType, items));
    this.toggleExcessItems(items);
    this.addTrailingText(itemType, items);
  }

  /**
   *
   * @returns {number} Number of item to display by default
   */
  getMaxItems() {
    if (this.window.matchMedia('(min-width: 730px)').matches) {
      return 9;
    }

    return 1;
  }

  /**
   *
   * @returns {number} Number of item to display by default
   */
  getAuthorsCount() {
    if (this.window.matchMedia('(max-width: 729px)').matches && this.authors.length > this.authorLimits[0]) {
      return this.authorLimits[0];
    }

    if (this.window.matchMedia('(min-width: 730px)').matches && this.authors.length > this.authorLimits[1]) {
      return this.authorLimits[1];
    }

    return this.authors.length;
  }

  /**
   * Returns array of elements in excess of the default max items, or null if itemType invalid.
   *
   * The returned array is a subset of the list supplied, or empty if there are no excess items.
   *
   * @param {string} itemType 'institution'
   * @param {DOMTokenList} items List of items from which to identify the excess
   * @returns {Array|null} Items in excess of the default maximum for the current screen width
   */
  getExcessItems(itemType, items) {
    if (itemType !== 'institution') {
      return null;
    }

    const maxItems = this.getMaxItems();
    if (items.length > maxItems) {
      return [].slice.call(items, maxItems);
    }

    return [];
  }

  /**
   * Marks supplied list elements as excess.
   *
   * @param {Array} els The elements to mark as excess
   */
  markAsExcess(els) {
    els.forEach(function ($el) {
      $el.classList.add('excess-item');
    });
  }

  /**
   * Clears any excess mark from all elements in the supplied list.
   *
   * @param {DOMTokenList} els The elements to clear the excess mark from
   */
  clearExcessMark(els) {
    [].forEach.call(els, function ($el) {
      $el.classList.remove('excess-item');
    });
  }

  /**
   * Toggles the display of any excess items found in the supplied list of elements.

   * @param {DOMTokenList} items The elements to inspect for excess items, and to toggle those found
   */
  toggleExcessItems(items) {
    [].forEach.call(items, function (item) {
      if (item.classList.contains('excess-item')) {
        item.classList.add('visuallyhidden');
      } else {
        item.classList.remove('visuallyhidden');
      }
    });
  }

  /**
   * Marks the last shown non-excess item with particlular class (so not if showing last in list).
   *
   * @param {string} itemType 'institution'
   * @param {DOMTokenList} items List of items to act upon
   */
  markLastNonExcessItem(itemType, items) {
    let lastShownIndex = null;
    let foundLastShown = false;
    [].forEach.call(items, function (item, i) {

      // Clear old any obsolete determination of what's the last non-excess item.
      if (item.querySelector('.' + itemType)) {
        item.querySelector('.' + itemType)
            .classList.remove(itemType + '--last-non-excess');
        if (item.classList.contains('excess-item') && !foundLastShown) {
          lastShownIndex = i - 1;
          foundLastShown = true;
        }
      }
    });

    if (lastShownIndex !== null && lastShownIndex > -1) {
      let lastShown = items[lastShownIndex].querySelector('.' + itemType);
      if (lastShown) {
        lastShown.classList.add(itemType + '--last-non-excess');
      }
    }

  }

  /**
   * Adds trailing text to the visible end of truncated author & institution lists & builds toggle.
   *
   * @param {string} itemType The type of items supplied
   * @param {DOMTokenList} items The items to which to add the trailing text
   */
  addTrailingText(itemType, items) {
    if (itemType === 'author') {
      this.authorToggle = this.$elm.querySelector('.item_toggle--author');
      this.expandedSeeMore = this.$elm.querySelector('.author_list--expanded');

      if (items.length > this.getAuthorsCount() && this.authorToggle === null) {
        if (this.expandedSeeMore !== null) {
          this.buildSeeMoreLessToggle('author', 'expanded');
        } else {
          this.buildSeeMoreLessToggle('author');
        }
      } else if (items.length <= this.getAuthorsCount() && this.authorToggle !== null) {
        this.authorToggle.parentNode.removeChild(this.authorToggle);
      }
    }

    if (itemType === 'institution' && items.length > this.getMaxItems()) {
      if (!this.hasToggleInstitution) {
        this.buildSeeMoreLessToggle('institution');
        this.hasToggleInstitution = true;
      }

      this.markLastNonExcessItem(itemType, items);
    }
  }

  getToggleCollapsedText() {
    const baseText = '<span class="visuallyhidden"> expand author list</span>';
    if (this.window.matchMedia('(min-width: 730px)').matches) {
      return `${baseText}<span aria-hidden="true">see&nbsp;all</span>`;
    }

    return `et al.${baseText}`;
  }

  getToggleExpandedText() {
    const baseText = '<span class="visuallyhidden"> collapse author list</span>';
    return `${baseText}<span aria-hidden="true">see&nbsp;less</span>`;
  }

  getUpdatedToggleText(newState) {
    if (newState === 'expanded') {
      return this.getToggleExpandedText();
    }

    if (newState === 'collapsed') {
      return this.getToggleCollapsedText();
    }

    // This has been invoked because of a resize, not a state change
    if (this.$elm.querySelector('.item_toggle--expanded')) {
      return this.getToggleExpandedText();
    }

    if (this.$elm.querySelector('.item_toggle--collapsed')) {
      return this.getToggleCollapsedText();
    }

  }

  updateToggleState(newState, toggle, itemType) {
    if (newState !== 'expanded' && newState !== 'collapsed') {
      return;
    }

    toggle.innerHTML = this.getUpdatedToggleText(newState);
    toggle.parentNode.classList.toggle('item_toggle--expanded');
    toggle.parentNode.classList.toggle('item_toggle--collapsed');

    if (newState === 'expanded') {
      this.$elm.querySelector(`.${itemType}_list`).classList
          .add(`${itemType}_list--expanded`);
    } else {
      this.$elm.querySelector(`.${itemType}_list`).classList
          .remove(`${itemType}_list--expanded`);
    }
  }

  /**
   * Builds the show/hide toggle for excess authors & institutions.
   */
  buildSeeMoreLessToggle(itemType, state = 'collapsed') {
    const $toggleWrapper = utils.buildElement(
      'li',
      ['item_toggle', 'item_toggle--' + state, 'item_toggle--' + itemType
      ],
      '',
      this.$elm.querySelector('.' + itemType + '_list')
    );
    $toggleWrapper.setAttribute('aria-hidden', 'true');

    const $toggle = utils.buildElement(
      'button',
      ['author_link_highlight'],
      this.getUpdatedToggleText(state),
      $toggleWrapper
    );

    const handleSeeMoreLessPress = (e) => {
      e.preventDefault();
      const $toggleWrapper = e.currentTarget.parentNode;
      let newState;
      if ($toggleWrapper.classList.contains('item_toggle--collapsed')) {
        if (itemType === 'institution') {
          this.showAllItems();
        }

        newState = 'expanded';
      } else {
        if (itemType === 'institution') {
          this.hideAllExcessItems();
        }

        newState = 'collapsed';
      }

      this.updateToggleState(newState, e.currentTarget, itemType);
    };

    $toggle.addEventListener('click', handleSeeMoreLessPress);
  }

  showAllItems() {
    this.clearExcessMark(this.institutions);
    this.toggleExcessItems(this.institutions);
  }

  hideAllExcessItems() {
    this.markLastNonExcessItem('institution', this.institutions);
    this.hideExcessItems('institution', this.institutions);
  }

};
