'use strict';

module.exports = class ContentHeaderArticle {

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

    // Should track SASS variable $bkpt-content-header.
    this.breakpointInPx = 560;
    this.currentView = this.calcCurrentView(this.breakpointInPx);

    this.authors = $elm.querySelectorAll('.content-header__author_list_item');
    this.institutions = $elm.querySelectorAll('.content-header__institution_list_item');

    this.hasToggleAuthor = false;
    this.hasToggleInstitution = false;
    this.hideAllExcessItems('author', this.authors);
    this.hideAllExcessItems('institution', this.institutions);

    let _this = this;
    this.window.addEventListener('resize', () => {
      let newView = _this.calcCurrentView(_this.breakpointInPx);
      if (newView !== _this.currentView) {
        _this.currentView = newView;
        _this.handleAnyExcessItems('author', _this.authors);
        _this.handleAnyExcessItems('institution', _this.institutions);
      }
    });

  }

  handleAnyExcessItems(itemType, items) {
    let toggle = this.$elm.querySelector('.content-header__item_toggle');
    if (toggle && toggle.innerHTML.indexOf('less') > -1 && this.currentView === 'wide') {
      this.clearExcessMark(items);
      this.toggleExcessItems(items);
    } else {
      this.clearExcessMark(items);
      let excessItems = this.getExcessItems(itemType, items);
      this.markAsExcess(excessItems);
      this.toggleExcessItems(items);
      this.markLastNonExcessItem(itemType, items);
    }
  }

  /**
   * Determine excess by itemType from items supplied and hides those.
   *
   * @param {string} itemType 'author' or 'institution'
   * @param {DOMTokenList} items List of items to identify the excess within, and hide those
   */
  hideAllExcessItems(itemType, items) {
    let excessItems = this.getExcessItems(itemType, items);
    this.markAsExcess(excessItems);
    this.toggleExcessItems(items);
    this.addTrailingText(itemType, items);
  }

  /**
   * Returns max number authors or institutions to be displayed by default at current screen width.
   *
   * Returns null if itemType is invalid.
   *
   * @param {string} itemType 'author' or 'institution'
   * @returns {number|null} Number of the type of item to display by default at current screen width
   */
  getDefaultMaxItems(itemType) {
    if (this.currentView === 'wide') {
      if (itemType === 'author') {
        return 16;
      }

      if (itemType === 'institution') {
        return 10;
      }

    } else {
      if (itemType === 'author') {
        return 1;
      }

      if (itemType === 'institution') {
        return 0;
      }
    }

    return null;
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

    let defaultMaxItems = this.getDefaultMaxItems(itemType);
    if (items.length > defaultMaxItems) {
      return [].slice.call(items, defaultMaxItems);
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
   * Returns the name of the current view.
   *
   * @param {number} breakpoint The px viewport width that determines the view.
   *
   * @returns {string} the view name ('wide' or 'narrow').
   */
  calcCurrentView(breakpoint) {
    return this.window.matchMedia('(min-width: ' + breakpoint + 'px)').matches ? 'wide' : 'narrow';
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
      items[i].classList.remove('content-header__' + itemType + '--last-non-excess');
      if (item.classList.contains('excess-item') && !foundLastShown) {
        lastShownIndex = i - 1;
        foundLastShown = true;
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
    if (itemType === 'author' && items.length > this.getDefaultMaxItems('author')) {
      if (!this.hasToggleAuthor) {
        this.buildSeeMoreLessToggle('author');
        this.hasToggleAuthor = true;
      }

    }

    if (itemType === 'institution' && items.length > this.getDefaultMaxItems('institution')) {
      if (!this.hasToggleInstitution) {
        this.buildSeeMoreLessToggle('institution');
        this.hasToggleInstitution = true;
      }

    }

    this.markLastNonExcessItem(itemType, items);
  }

  /**
   * Builds the show/hide toggle for excess authors & institutions.
   */
  buildSeeMoreLessToggle(itemType) {
    // This toggle only required due to screen width constraints. All content already accessible as
    // it's not being hidden in the first place. Hence an aria-hidden li, rather than an anchor.
    // Should conform to https://www.w3.org/TR/wai-aria/states_and_properties#aria-hidden
    let toggle = this.doc.createElement('li');
    let toggleOnText = 'see&nbsp;all';
    let toggleOffText = 'see&nbsp;less';
    toggle.setAttribute('aria-hidden', 'true');
    toggle.classList.add('content-header__item_toggle', 'content-header__item_toggle--' + itemType);
    toggle.innerHTML = '&nbsp;&hellip;&nbsp;' + toggleOnText;
    toggle.addEventListener('click', e => {
      let target = e.target;
      if (target.innerHTML.indexOf(toggleOnText) > -1) {
        [].forEach.call(this.doc.querySelectorAll('.content-header__item_toggle'), item => {
          item.innerHTML = '&nbsp;' + toggleOffText;
        });
        this.clearExcessMark(this.authors);
        this.clearExcessMark(this.institutions);
        this.toggleExcessItems(this.authors);
        this.toggleExcessItems(this.institutions);
      } else {
        [].forEach.call(this.doc.querySelectorAll('.content-header__item_toggle'), item => {
          item.innerHTML = '&nbsp;&hellip;&nbsp;' + toggleOnText;
        });
        this.hideAllExcessItems('author', this.authors);
        this.hideAllExcessItems('institution', this.institutions);
      }
    });
    this.$elm.querySelector('.content-header__' + itemType + '_list').appendChild(toggle);
  }

};
