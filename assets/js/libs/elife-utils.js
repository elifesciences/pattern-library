module.exports = () => {
  'use strict';

  /**
   * Builds and returns specified HTML element, optionally adding it to the DOM.
   *
   * @param {string} elName Name of the HTML element to build
   * @param {Array} [cssClasses] CSS class name(s) to set on the element
   * @param {string} [textContent] Textual content of the element
   * @param {string|Element} [parent] Parent element to attach to
   * @param {string|Element|boolean} [attachBefore] Following sibling (1st if true, last if falsey)
   *
   * @returns {Element}
   */
  function buildElement(elName, cssClasses, textContent, parent, attachBefore) {

    var $el = document.createElement(elName);
    var $parent = typeof parent === 'string' ? document.querySelector(parent)
      : parent;

    // Work out what the new element's following sibling will be, based on value of attachBefore.
    var $followingSibling = (function () {

      if (!!attachBefore) {

        if (typeof attachBefore === 'boolean') {
          return $parent.firstElementChild;

        } else if (typeof attachBefore === 'string') {
          return document.querySelector(attachBefore);

        } else if (attachBefore instanceof HTMLElement) {
          return attachBefore;

        }
      }
    }());

    cssClasses.forEach(cssClass => {
      $el.classList.add(cssClass);
    });

    if (textContent) {
      $el.innerHTML = textContent;
    }

    if (!!$parent && !!$followingSibling) {
      $parent.insertBefore($el, $followingSibling);
    } else {
      $parent.appendChild($el);
    }

    return $el;
  }

  var uniqueIds = (function uniqueIds() {

    class UniqueIdentifiers {

      constructor () {
        this.used = [];
      }

      isValid(candidate, document) {
        // Compulsory check that id is unique to this object's knowledge.
        if (this.used.indexOf(candidate) > -1) {
          return false;
        }

        // Optional check to see if id is unique in the DOM.
        if (!!document) {
          if (!!document.querySelector &&
              typeof document.querySelector === 'function' &&
              document.querySelector('#' + candidate)) {
            return false;
          }
        }

        return true;
      }

      /**
       * Gets a unique id with optional prefix.
       *
       * @param {string} [prefix] Prefix to use for the id
       * @param {HTMLDocument} [document] Enables checking for the id's uniqueness within the DOM
       * @returns {string}
       */
      get(prefix, document) {
        var _prefix = '' + prefix || 'default_';
        var random = ('' + Math.random()).replace(/\./, '');
        var candidate = _prefix + random;
        if (this.isValid(candidate)) {
          return candidate;
        }

        this.get(prefix, document);
      }
    }

    return new UniqueIdentifiers();
  }());

  /**
   * Updates the CSS transform's translate function on the element in a vendor-prefix-aware fashion.
   *
   * Because of the way CSS transformations are combined into a matrix, this may not work
   * as expected if other CSS transformations are also applied to the same element.
   *
   * @param {HTMLElement} $el The element to apply the transformation to.
   * @param {Array} offset The offset for both axes, expressed as [x, y], e.g. [0, '20px']
   */
  function updateElementTranslate($el, offset) {
    if (!($el instanceof HTMLElement && Array.isArray(offset))) {
      return;
    }

    let props = ['webkitTransform', 'mozTransform', 'msTransform', 'oTransform', 'transform'];
    let offsetX = offset[0];
    let offsetY = offset[1] || 0;

    props.forEach((prop) => {
      $el.style[prop] = 'translate(' + offsetX + ', ' + offsetY + ')';
    });
  }

  /**
   * Add a quantity to a px amount expressed as a string, and return new string with updated value.
   *
   * For example: adjustPxString('97px', 8) returns '105px'
   *
   * @param {String} pxString The string representing the original quantity, e.g. '97px'
   * @param adjustment The numeric adjustment to make, e.g. 8
   * @returns {string} The modified value, as a string, e.g.: '105px'
   */
  function adjustPxString(pxString, adjustment) {
    let originalSize = parseInt(pxString.match(/([-0-9.]+)px/)[1], 10);
    let newSize = originalSize + adjustment;
    return newSize + 'px';
  }

  /**
   * Invert the px amount expressed as a string, and return new string with inverted value.
   *
   * For example: invertPxString('97px') returns '-97px'
   *
   * @param {String} pxString The string representing the original quantity, e.g. '97px'
   * @returns {string} The modified value, as a string, e.g.: '-97px'
   */
  function invertPxString(pxString) {
    let originalSize = parseInt(pxString.match(/([-0-9.]+)px/)[1], 10);
    let newSize = originalSize * -1;
    return newSize + 'px';
  }

  /**
   * Returns true if $prospectiveDescendant is, or is a descendant of $prospectiveParent.
   *
   * @param {HTMLElement} $prospectiveParent el to test as a parent of the $prospectiveDescendant
   * @param {HTMLElement} $prospectiveDescendant el to test as descendant of the $prospectiveParent
   * @returns {boolean} Whether the s$prospectiveDescendant is, or descends from $prospectiveParent
   */
  function areElementsNested($prospectiveParent, $prospectiveDescendant) {
    let relationship = $prospectiveParent.compareDocumentPosition($prospectiveDescendant);
    return !!(
      relationship & $prospectiveParent.DOCUMENT_POSITION_CONTAINED_BY || relationship === 0
    );
  }

  /**
   * Return the current viewport width.
   *
   * @returns {number} The current viewport width
   */
  function getViewportWidth() {
    return document.documentElement.clientWidth;
  }

  /**
   * Returns whether the display is considered to have a high pixel density ratio.
   *
   * @param window
   * @returns {boolean} true if dpr >= 2, false if lower, or unknown.
   */
  function isHighDpr(window) {
    if (!!window.devicePixelRatio) {
      return window.devicePixelRatio >= 2;
    }

    return false;
  }

  return {
    adjustPxString: adjustPxString,
    areElementsNested: areElementsNested,
    buildElement: buildElement,
    getViewportWidth: getViewportWidth,
    invertPxString: invertPxString,
    isHighDpr: isHighDpr,
    uniqueIds: uniqueIds,
    updateElementTranslate: updateElementTranslate,
  };

};
