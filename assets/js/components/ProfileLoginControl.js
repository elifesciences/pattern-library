'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class ProfileLoginControl {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    try {
      this.getData($elm);
    } catch (e) {
      return;
    }

    this.setupEventListeners(this.$elm.appendChild(this.buildMenu()));
    this.$elm.removeChild(this.$elm.querySelector('.profile-login-control__non_js_control_link'));

  }

  setupEventListeners($menu) {
    const $target = $menu.querySelector('.profile-login-control__controls_toggle');
    if ($target) {
      $menu.querySelector('.profile-login-control__controls_toggle')
           .addEventListener('click', this.handleControlsToggle.bind(this));
    }
  }

  handleControlsToggle() {
    this.$elm.querySelector('.profile-login-control__controls').classList.toggle('hidden');

  }

  // TODO: pass buildElement as arg and call/apply that, may make for better testing
  buildMenu() {
    this.window.console.log('building control');
    const buildElement = utils.buildElement;
    /*
    We need to build this:
      <nav>
    <!--<a href="{{profileHomeLink}}" class="profile-login-control__non_js_control_link">
    {{displayName}}</a>-->
<picture>
  <source srcset="../../assets/img/icons/profile.svg">
    <img
    srcset="../../assets/img/icons/profile@2x.png 70w, ../../assets/img/icons/profile.png 35w"
    src="../../assets/img/icons/profile.png"
    alt="Profile icon">
  </picture>
    <ul class="profile-login-control__controls">
      <li class="profile-login-control__control">
        <a href="{{profileHomeLink}}" class="profile-login-control__link">
          <div class="profile-login-control__display_name">{{displayName}}</div>
          <div class="profile-login-control__subsidiary_text">View my profile</div>
        </a>
      </li>
      <li class="profile-login-control__control">
        <a href="{{profileManageLink}}" class="profile-login-control__link">Manage profile</a>
        </li>
      <li class="profile-login-control__control">
        <a href="{{logoutUri}}" class="profile-login-control__link">Logout</a>
        </li>
    </ul>
  </nav>
    * */
    const $nav = buildElement('nav');

    const $toggleLink = buildElement('a', ['profile-login-control__controls_toggle'], '', $nav);
    $toggleLink.href = '#';

    const $picture = buildElement('picture', [], '', $toggleLink);
    const $source = buildElement('source', [], '', $picture);
    $source.setAttribute('srcset', '../../assets/img/icons/profile.svg');

    const $img = buildElement('img', [], '', $picture);
    $img.setAttribute('srcset',
        '../../assets/img/icons/profile@2x.png 70w, ../../assets/img/icons/profile.png 35w');
    $img.setAttribute('src', '../../assets/img/icons/profile.png');
    $img.setAttribute('alt', 'profile icon');

    const $list = buildElement('ul', ['profile-login-control__controls', 'hidden'], '', $nav);

    const $firstItem = buildElement('li', ['profile-login-control__control'], '', $list);
    const $firstItemLink = buildElement('a', ['profile-login-control__link'], '', $firstItem);
    $firstItemLink.setAttribute('href', this.profileHomeLink);
    buildElement('div', ['profile-login-control__display_name'], this.displayName, $firstItemLink);
    buildElement('div', ['profile-login-control__subsidiary_text'], 'View my profile', $firstItemLink);

    const $secondItem = buildElement('li', ['profile-login-control__control'], '', $list);
    const $secondItemLink = buildElement('a', ['profile-login-control__link'], 'Manage profile', $secondItem);
    $secondItemLink.setAttribute('href', this.profileManageLink);

    const $thirdItem = buildElement('li', ['profile-login-control__control'], '', $list);
    const $thirdItemLink = buildElement('a', ['profile-login-control__link'], 'Logout', $thirdItem);
    $thirdItemLink.setAttribute('href', this.logoutLink);

    return $nav;
  }

  buildToggle() {

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

};
