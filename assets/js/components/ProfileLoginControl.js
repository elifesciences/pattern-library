'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class ProfileLoginControl {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    try {
      this.getData($elm);
      this.setupEventListeners(this.$elm.appendChild(this.buildMenu()));
    } catch (e) {
      return;
    }

    this.$elm.removeChild(this.$elm.querySelector('.profile-login-control__non_js_control_link'));

  }

  setupEventListeners($menu) {
    const $target = $menu.querySelector('.profile-login-control__controls_toggle');
    if ($target) {
      $target.addEventListener('click', this.toggle.bind(this));
    }
  }

  buildMenu() {
    const $nav = utils.buildElement('nav');
    $nav.appendChild(ProfileLoginControl.buildToggle());
    this.$list = this.buildList();
    $nav.appendChild(this.$list);

    return $nav;
  }

  static buildToggle() {
    const $toggle = utils.buildElement('a', ['profile-login-control__controls_toggle']);
    $toggle.href = '#';

    const $picture = utils.buildElement('picture', [], '', $toggle);
    const $source = utils.buildElement('source', [], '', $picture);
    $source.setAttribute('srcset', '../../assets/img/icons/profile.svg');

    const $img = utils.buildElement('img', [], '', $picture);
    $img.setAttribute('srcset',
                      '../../assets/img/icons/profile@2x.png 70w, ../../assets/img/icons/profile.png 35w');
    $img.setAttribute('src', '../../assets/img/icons/profile.png');
    $img.setAttribute('alt', 'profile icon');

    return $toggle;
  }

  buildList() {
    const $list = utils.buildElement('ul', ['profile-login-control__controls', 'hidden']);

    const $firstItem = utils.buildElement('li', ['profile-login-control__control'], '', $list);
    const $firstItemLink = utils.buildElement('a', ['profile-login-control__link'], '', $firstItem);
    $firstItemLink.setAttribute('href', this.profileHomeLink);
    utils.buildElement('div', ['profile-login-control__display_name'], this.displayName, $firstItemLink);
    utils.buildElement('div', ['profile-login-control__subsidiary_text'], 'View my profile', $firstItemLink);

    const $secondItem = utils.buildElement('li', ['profile-login-control__control'], '', $list);
    const $secondItemLink = utils.buildElement('a', ['profile-login-control__link'], 'Manage profile', $secondItem);
    $secondItemLink.setAttribute('href', this.profileManageLink);

    const $thirdItem = utils.buildElement('li', ['profile-login-control__control'], '', $list);
    const $thirdItemLink = utils.buildElement('a', ['profile-login-control__link'], 'Logout', $thirdItem);
    $thirdItemLink.setAttribute('href', this.logoutLink);

    return $list;
  }

  getData($elm) {
    this.displayName = ProfileLoginControl.getDisplayName($elm);
    this.profileHomeLink = ProfileLoginControl.getProfileHomeLink($elm);
    this.profileManageLink = ProfileLoginControl.getProfileManageLink($elm);
    this.logoutLink = ProfileLoginControl.getLogoutLink($elm);
    if (!this.displayName || !this.profileHomeLink || !this.profileHomeLink || !this.logoutLink) {
      throw new Error('Mandatory data missing for profile. Can\'t build login control');
    }

  }

  static getDisplayName($elm) {
    return $elm.dataset.displayName;
  }

  static getProfileHomeLink($elm) {
    return $elm.dataset.profileHomeLink;
  }

  static getProfileManageLink($elm) {
    return $elm.dataset.profileManageLink;
  }

  static getLogoutLink($elm) {
    return $elm.dataset.logoutUri;
  }

  /**
   * Toggles the download links list display.
   *
   * @param e The event triggering the display toggle
   */
  toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }

  }

  /**
   * Returns whether links list is currently viewable.
   *
   * @returns {boolean} Whether links list is currently viewable
   */
  isOpen() {
    return !this.$list.classList.contains('hidden');
  }

  /**
   * Make viewable.
   */
  open() {
    this.$list.classList.remove('hidden');
    this.window.addEventListener('click', this.checkForClose.bind(this));
  }

  /**
   * Checks whether a click occurred outside this, and close this if it did.
   *
   * @param e The click event to evaluate the target of
   */
  checkForClose(e) {
    if (!utils.areElementsNested(this.$list, e.target)) {
      this.close();
    }
  }

  /**
   * Make unviewable.
   */
  close() {
    this.$list.classList.add('hidden');
    this.window.removeEventListener('click', this.checkForClose.bind(this));
  }

};
