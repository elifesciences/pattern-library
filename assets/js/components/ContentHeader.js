'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class ContentHeader {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;
    this.$elm.classList.add('content-header--js');

    this.authors = $elm.querySelectorAll('.content-header__author_list_item');
    this.institutions = $elm.querySelectorAll('.content-header__institution_list_item');

    if (this.authors.length > 0) {
      this.authors[this.authors.length - 1].classList.add('content-header__author_list_item--last');
    }

    if (this.institutions.length > 0) {
      this.institutions[this.institutions.length - 1].classList.add('content-header__institution_list_item--last');
    }

    this.hasToggleAuthor = false;
    this.hasToggleInstitution = false;
    this.hideAllExcessItems();
    this.setupResizeHandler();
  }

  setupResizeHandler() {
    this.currentClientWidth = document.body.clientWidth;
    this.window.addEventListener('resize', utils.debounce(() => this.handleResize(), 30));
  }

  handleResize() {
    // Android (at least), may fire resize on initial scroll as url bar moves off the top of the
    // screen, and the height of the browser window increases until the top edge is at the top of
    // the screen.
    if (this.currentClientWidth === document.body.clientWidth) {
      return;
    }

    this.currentClientWidth = document.body.clientWidth;
    if (!this.$elm.querySelector('.content-header__author_list--expanded')) {
      this.hideAllExcessItems();
    }

    const toggles = this.$elm.querySelectorAll(
      '.content-header__item_toggle .content-header__author_link_highlight'
    );
    const updateToggleText = this.getUpdatedToggleText.bind(this);
    [].forEach.call(toggles, ($toggle) => {
      $toggle.innerHTML = updateToggleText();
    });
  }

  /**
   * Determine excess by itemType from items supplied and hides those.
   *
   * @param {string} itemType 'author' or 'institution'
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

    if (this.authors.length === 2) {
      return 2;
    }

    return 1;
  }

  /**
   * Returns array of elements in excess of the default max items, or null if itemType invalid.
   *
   * The returned array is a subset of the list supplied, or empty if there are no excess items.
   *
   * @param {string} itemType 'author' or 'institution'
   * @param {DOMTokenList} items List of items from which to identify the excess
   * @returns {Array|null} Items in excess of the default maximum for the current screen width
   */
  getExcessItems(itemType, items) {
    if (itemType !== 'author' && itemType !== 'institution') {
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
   * @param {string} itemType 'author' or 'institution'
   * @param {DOMTokenList} items List of items to act upon
   */
  markLastNonExcessItem(itemType, items) {
    let lastShownIndex = null;
    let foundLastShown = false;
    [].forEach.call(items, function (item, i) {

      // Clear old any obsolete determination of what's the last non-excess item.
      if (item.querySelector('.content-header__' + itemType)) {
        item.querySelector('.content-header__' + itemType)
            .classList.remove('content-header__' + itemType + '--last-non-excess');
        if (item.classList.contains('excess-item') && !foundLastShown) {
          lastShownIndex = i - 1;
          foundLastShown = true;
        }
      }
    });

    if (lastShownIndex !== null && lastShownIndex > -1) {
      let lastShown = items[lastShownIndex].querySelector('.content-header__' + itemType);
      if (lastShown) {
        lastShown.classList.add('content-header__' + itemType + '--last-non-excess');
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
    if (itemType === 'author' && items.length > this.getMaxItems()) {
      if (!this.hasToggleAuthor) {
        this.buildSeeMoreLessToggle('author');
        this.hasToggleAuthor = true;
      }

    }

    if (itemType === 'institution' && items.length > this.getMaxItems()) {
      if (!this.hasToggleInstitution) {
        this.buildSeeMoreLessToggle('institution');
        this.hasToggleInstitution = true;
      }

    }

    this.markLastNonExcessItem(itemType, items);
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
    if (this.window.matchMedia('(min-width: 730px)').matches) {
      return `${baseText}<span aria-hidden="true">see&nbsp;less</span>`;
    }

    return `${baseText}<span aria-hidden="true" class="content-header__item_toggle_cta">&#171;</span>`;
  }

  getUpdatedToggleText(newState) {
    if (newState === 'expanded') {
      return this.getToggleExpandedText();
    }

    if (newState === 'collapsed') {
      return this.getToggleCollapsedText();
    }

    // This has been invoked because of a resize, not a state change
    if (this.$elm.querySelector('.content-header__item_toggle--expanded')) {
      return this.getToggleExpandedText();
    }

    if (this.$elm.querySelector('.content-header__item_toggle--collapsed')) {
      return this.getToggleCollapsedText();
    }

  }

  updateToggleState(newState, toggles) {
    if (newState !== 'expanded' && newState !== 'collapsed') {
      return;
    }

    [].forEach.call(toggles, ($toggle) => {
      $toggle.innerHTML = this.getUpdatedToggleText(newState);
      $toggle.parentNode.classList.toggle('content-header__item_toggle--expanded');
      $toggle.parentNode.classList.toggle('content-header__item_toggle--collapsed');
    });

    if (newState === 'expanded') {
      this.$elm.querySelector('.content-header__author_list').classList
          .add('content-header__author_list--expanded');
      this.$elm.querySelector('.content-header__institution_list').classList
        .add('content-header__institution_list--expanded');
    } else {
      this.$elm.querySelector('.content-header__author_list').classList
          .remove('content-header__author_list--expanded');
      this.$elm.querySelector('.content-header__institution_list').classList
        .remove('content-header__institution_list--expanded');
    }
  }

  /**
   * Builds the show/hide toggle for excess authors & institutions.
   */
  buildSeeMoreLessToggle(itemType) {
    const $toggleWrapper = utils.buildElement(
      'li',
      ['content-header__item_toggle', 'content-header__author_list_item',
       'content-header__item_toggle--collapsed', 'content-header__item_toggle--' + itemType
      ],
      '',
      this.$elm.querySelector('.content-header__' + itemType + '_list')
    );
    $toggleWrapper.setAttribute('aria-hidden', 'true');

    const $toggle = utils.buildElement(
      'button',
      ['content-header__author_link_highlight'],
      this.getUpdatedToggleText('collapsed'),
      $toggleWrapper
    );

    const handleSeeMoreLessPress = (e) => {
      e.preventDefault();
      const $toggleWrapper = e.currentTarget.parentNode;
      let newState;
      if ($toggleWrapper.classList.contains('content-header__item_toggle--collapsed')) {
        this.showAllItems();
        newState = 'expanded';
      } else {
        this.hideAllExcessItems();
        newState = 'collapsed';
      }

      this.updateToggleState(newState,
                             this.$elm.querySelectorAll(
                          '.content-header__item_toggle .content-header__author_link_highlight'
                        ),
                             itemType);

    };

    $toggle.addEventListener('click', handleSeeMoreLessPress);
  }

  showAllItems() {
    this.clearExcessMark(this.authors);
    this.clearExcessMark(this.institutions);
    this.toggleExcessItems(this.authors);
    this.toggleExcessItems(this.institutions);
  }

  hideAllExcessItems() {
    this.markLastNonExcessItem('author', this.authors);
    this.markLastNonExcessItem('institution', this.institutions);
    this.hideExcessItems('author', this.authors);
    this.hideExcessItems('institution', this.institutions);
  }

};
