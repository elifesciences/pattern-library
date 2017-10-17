'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class LoginControl {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    try {
      this.setPropertiesFromDataAttributes(
        LoginControl.deriveDataAttributeRoots(
          this.$elm.dataset.linkFieldRoots,
          this.$elm
        ),
        this.$elm
      );
      this.$control = this.buildControl(this.extraLinksToBuild, this.$elm, utils.buildElement);
    } catch (e) {
      // TODO: When removing, Log to NR instead?
      this.window.console.log(e);
      return;
    }

    this.$elm.appendChild(this.$control);

    const nonJsLink = this.$elm.querySelector('.login-control__non_js_control_link');
    if (nonJsLink) {
      this.$elm.removeChild(nonJsLink);
    }
  }

  /**
   * Returns an array of expected data attribute roots, based on the supplied comma-delimited string
   *
   * Each item in rootsList describes the root name of a set of two data attributes that will
   * together describe the text and uri of a link that is to be included in the control.
   *
   * For example:
   *
   * If rootsList were to have the value "profile-manage-link, logout", this would specify that
   * there are two links described, and that the the data attributes that define them are:
   *
   *  - data-profile-manage-link-text: defines the display text of the profile manage link
   *  - data-profile-manage-link-uri: defines the uri of the profile manage link
   *
   *  - data-logout-text: defines the display text of the logout link
   *  - data-logout-uri: defines the uri of the logout link
   *
   *  In this case the return value would be the array:
   *
   *    ['profile-manage-link-text', 'profile-manage-link-uri', 'logout-text', 'logout-uri']
   *
   * If any of the data attributes implied by rootsList are missing or empty, it is an error.
   *
   * @param {String} rootsList comma-delimited list of data attribute root names
   * @param {HTMLElement} $elm HTML element that the data attributes belong to
   *
   * @throws {SyntaxError} if rootsList is invalid
   * @throws {ReferenceError} if required data attributes are missing
   *
   * @returns {Array.<String>} list of expected data attribute roots, will be empty if none found
   *
   */
  static deriveDataAttributeRoots(rootsList, $elm) {
    if (!LoginControl.validateDataAttributeRootsList(rootsList)) {
      throw new SyntaxError('invalid roots list supplied');
    }

    const dataAttributeRoots = rootsList.split(',').map(root => root.trim());
    if (!dataAttributeRoots[0].length) {
      return [];
    }

    if (!LoginControl.areAllImpliedDataAttributesPresent(dataAttributeRoots, $elm)) {
      throw new ReferenceError('One or more required data attributes implied by data-link-field-roots are missing');
    }

    return dataAttributeRoots;
  }

  /**
   * Returns false if not all data attributes implied by dataAttributeRoots are present
   *
   * @param {Array.<String>} dataAttributeRoots list of expected data attribute roots
   * @param {HTMLElement} $elm HTML element that the data attributes belong to
   * @return {boolean} false if not all data attributes implied by dataAttributeRoots are present
   */
  static areAllImpliedDataAttributesPresent(dataAttributeRoots, $elm) {
    let areAllPresent = true;
    dataAttributeRoots.forEach((root) => {
      if (!$elm.dataset[LoginControl.convertKebabCaseToCamelCase(`${root}-uri`)] ||
          !$elm.dataset[LoginControl.convertKebabCaseToCamelCase(`${root}-text`)]
      ) {
        areAllPresent = false;
      }
    });

    return areAllPresent;
  }

  /**
   * Indicates validity of list of data attribute roots supplied
   *
   * The regex determining validity:
   *  - allows lower case js name characters, plus space, hyphen and commma
   *  - allows leading/trailing space
   *  - allows other space only when adjacent to a comma
   *  - disallows leading/trailing commas and hyphens on the string
   *  - disallows leading or trailing hyphens on a word
   *
   * @param {String} rootsList comma-delimited list of data attribute root names
   * @returns {boolean} whether the roots list string is valid
   */
  static validateDataAttributeRootsList(rootsList) {
    return typeof rootsList === 'string' &&
           rootsList.search(/^[ \t]*[a-z][a-z-$_]*[^-,][ \t]*(,[ \t]*[a-z][a-z-$_]*[^-,][ \t]*)*$/) > -1;
  }

  /**
   * Set object properties based on discovered HTML element data attributes, based on supplied roots
   *
   * @param {Array.<String>} dataAttributeRoots list of data attribute roots
   * @param {HTMLElement} $elm element containing the data attributes
   */
  setPropertiesFromDataAttributes(dataAttributeRoots, $elm) {
    this.displayName = $elm.dataset.displayName;
    this.defaultUri = $elm.dataset.defaultUri;
    this.extraLinksToBuild = LoginControl.deriveLinksToBuild(dataAttributeRoots, $elm);
  }

  /**
   * Returns array of objects describing the text & uris for the links to put into the menu control
   **
   * @param {Array.<String>} dataAttributeRoots list of data attribute root names to process
   * @param {HTMLElement} $elm element containing the data attributes
   * @return {Array.<{text: String, uri: String}>}
   */
  static deriveLinksToBuild(dataAttributeRoots, $elm) {
    const linksToBuild = [];
    dataAttributeRoots.forEach((dataAttributeRoot) => {
      const textDataAttribute = `${dataAttributeRoot}-text`;
      const textProperty = LoginControl.convertKebabCaseToCamelCase(textDataAttribute);
      const text = $elm.dataset[textProperty];

      const uriDataAttribute = `${dataAttributeRoot}-uri`;
      const uriProperty = LoginControl.convertKebabCaseToCamelCase(uriDataAttribute);
      const uri = $elm.dataset[uriProperty];

      if (text && uri) {
        linksToBuild.push({ text, uri });
      }
    });

    return linksToBuild;
  }

  /**
   * Derive a camelCased word from a kebab-cased word
   *
   * @param kebabCase the kebab-cased word (which is a data-attribute-name)
   * @returns {(String|null)}
   */
  static convertKebabCaseToCamelCase(kebabCase = '') {
    if (!kebabCase || typeof kebabCase !== 'string') {
      return null;
    }

    return kebabCase.replace(/\-([a-z])/g, (x) => x.substring(1).toUpperCase());
  }

  /**
   * Build the control
   *
   * This is the top level entry point for building the required DOM elements.
   *
   * @param {Array.<{text: String, uri: String}>} extraLinksToBuild data defining the links to build
   * @param {HTMLElement} $elm pattern-root element
   * @param {Function} buildElement Function used to build an element (elife-utils.buildElement)
   * @return {HTMLElement} The resulting control element
   */
  buildControl(extraLinksToBuild, $elm, buildElement) {
    const iconData = {
      pathRoot: $elm.dataset.iconPathRoot,
      srcset: $elm.dataset.iconSrcset,
      altText: $elm.dataset.iconAltText
    };

    const $nav = buildElement.call(null, 'nav');
    this.insertToggle($nav, iconData, buildElement);
    this.$menu = this.buildMenu(extraLinksToBuild, buildElement);
    $nav.appendChild(this.$menu);

    return $nav;
  }

  /**
   * Build and insert the menu toggle into the supplied container
   *
   * @param {HTMLElement} $container The required parent of the toggle
   * @param {Object} iconData data describing the icon
   * @param {String} iconData.pathRoot a common path component to all versions (so minus the file extension)
   * @param {String} iconData.srcset the srcset to use on the <img>
   * @param {String} iconData.atlText the text for the [alt]
   * @param {Function} buildElement Function used to build an element (elife-utils.buildElement)
   */
  insertToggle($container, iconData, buildElement) {
    const $toggle = buildElement.call(null, 'a', ['login-control__controls_toggle'], '', $container);
    $toggle.setAttribute('href', '#');
    $toggle.appendChild(LoginControl.buildIcon(iconData, buildElement));
    $toggle.addEventListener('click', this.toggle.bind(this));
  }

  /**
   * @param {Object} iconData data describing the icon
   * @param {String} iconData.pathRoot a common path component to all versions (so minus the file extension)
   * @param {String} iconData.srcset the srcset to use on the <img>
   * @param {String} iconData.atlText the text for the [alt]
   * @param {Function} buildElement Function used to build an element (elife-utils.buildElement)
   * @returns {HTMLElement} the <picture> describing the icon
   */
  static buildIcon(iconData, buildElement) {
    if (!(iconData.pathRoot && iconData.srcset && iconData.altText)) {
      return null;
    }

    const $icon = buildElement.call(null, 'picture');
    const $source = buildElement.call(null, 'source', [], '', $icon);
    $source.setAttribute('srcset', `${iconData.pathRoot}.svg`);

    const $img = buildElement.call(null, 'img', [], '', $icon);
    $img.setAttribute('srcset', iconData.srcset);
    $img.setAttribute('src', `${iconData.pathRoot}.png`);
    $img.setAttribute('alt', iconData.altText);

    return $icon;
  }

  /**
   * Build the menu
   *
   * @param {Array.<{text: String, uri: String}>} extraLinksToBuild data defining the links to build
   * @param {Function} buildElement Function used to build an element (elife-utils.buildElement)
   * @return {HTMLElement} The menu that has been built
   */
  buildMenu(extraLinksToBuild, buildElement) {
    const $list = buildElement.call(null, 'ul', ['login-control__controls', 'hidden']);
    this.insertDefaultLink($list, buildElement);
    this.insertExtraLinks(extraLinksToBuild, $list, buildElement);
    return $list;
  }

  /**
   * Build and insert the default link into the supplied container
   *
   * @param {HTMLElement} $container The required parent of the default link
   * @param {Function} buildElement Function used to build an element (elife-utils.buildElement)
   * @return {*}
   */
  insertDefaultLink($container, buildElement) {
    const $li = buildElement.call(null, 'li', ['login-control__control'], '', $container);
    const $a = buildElement.call(null, 'a', ['login-control__link'], '', $li);
    $a.setAttribute('href', this.defaultUri);
    buildElement.call(null, 'div', ['login-control__display_name'], this.displayName, $a);
    buildElement.call(null, 'div', ['login-control__subsidiary_text'], 'View my profile', $a);

    return $li;
  }

  /**
   * Build and insert the links defined by the arbitrary data attributes
   *
   * @param {Array.<{text: String, uri: String}>} extraLinksData data defining the links to build
   * @param {HTMLElement} $container The required parent of all the links
   * @param {Function} buildElement Function used to build an element (elife-utils.buildElement)
   */
  insertExtraLinks(extraLinksData, $container, buildElement) {
    if (!Array.isArray(extraLinksData) || !extraLinksData.length) {
      throw new Error('Unable to build extra links, no data supplied');
    }

    extraLinksData.forEach((extraLinkData) => {
      LoginControl.insertLink(extraLinkData, $container, buildElement);
    });
  }

  /**
   * Build and insert a link defined by a pair of arbitrary data attributes
   *
   * @param linkData {{text: String, uri: String}} data from which to create the link
   * @param {HTMLElement} $container The required parent of the link
   * @param {Function} buildElement Function used to build an element (elife-utils.buildElement)
   */
  static insertLink(linkData, $container, buildElement) {
    const $li = buildElement.call(null, 'li', ['login-control__control'], '', $container);
    const $a = buildElement.call(null, 'a', ['login-control__link'], linkData.text, $li);
    $a.setAttribute('href', linkData.uri);
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
    return !this.$menu.classList.contains('hidden');
  }

  /**
   * Make viewable.
   */
  open() {
    this.$menu.classList.remove('hidden');
    this.window.addEventListener('click', this.checkForClose.bind(this));
  }

  /**
   * Checks whether a click occurred outside this, and close this if it did.
   *
   * @param e The click event to evaluate the target of
   */
  checkForClose(e) {
    if (!utils.areElementsNested(this.$menu, e.target)) {
      this.close();
    }
  }

  /**
   * Make unviewable.
   */
  close() {
    this.$menu.classList.add('hidden');
    this.window.removeEventListener('click', this.checkForClose.bind(this));
  }

};
