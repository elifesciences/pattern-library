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

    if (Array.isArray(cssClasses)) {
      cssClasses.forEach(cssClass => {
        $el.classList.add(cssClass);
      });
    }

    if (textContent) {
      $el.innerHTML = textContent;
    }

    if (!!$parent) {
      // TODO: Handle what happens if following sibling is not a child of parent
      if (!!$followingSibling) {
        $parent.insertBefore($el, $followingSibling);
      } else {
        $parent.appendChild($el);
      }
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
        if (this.isValid(candidate, document)) {
          this.used.push(candidate);
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
      return false;
    }

    let props = ['webkitTransform', 'mozTransform', 'msTransform', 'oTransform', 'transform'];

    // Okay to have 0px not 0 here as a 0 value is represented as 0px within the transform property.
    let offsetX = offset[0] + 'px';
    let offsetY = offset[1] === undefined ? '0px' : offset[1] + 'px';

    props.forEach((prop) => {
      // Only set the vendor prefixed properties where they are supported
      if ($el.style[prop] !== undefined) {
        $el.style[prop] = 'translate(' + offsetX + ', ' + offsetY + ')';
      }
    });
  }

  function _getValueFromPxString(pxString) {
    if (pxString === '0') {
      return 0;
    }

    return parseInt(pxString.match(/([-0-9.]+)px/)[1], 10);
  }

  function _getZeroAwarePxStringFromValue(value) {
    if (value === 0) {
      return '' + value;
    }

    return value + 'px';
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
    let originalSize = _getValueFromPxString(pxString);
    let adjustedSize = originalSize + adjustment;
    return _getZeroAwarePxStringFromValue(adjustedSize);
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
    let originalSize = _getValueFromPxString(pxString);
    let adjustedSize = originalSize * -1;
    return _getZeroAwarePxStringFromValue(adjustedSize);
  }

  /**
   * Returns true if $prospectiveDescendant is, or is a descendant of $prospectiveParent.
   *
   * @param {Node} $prospectiveParent el to test as a parent of the $prospectiveDescendant
   * @param {Node} $prospectiveDescendant el to test as descendant of the $prospectiveParent
   * @returns {boolean} Whether the $prospectiveDescendant is, or descends from $prospectiveParent
   */
  function areElementsNested($prospectiveParent, $prospectiveDescendant) {
    if (!($prospectiveParent instanceof Node && $prospectiveDescendant instanceof Node)) {
      return false;
    }

    let relationship = $prospectiveParent.compareDocumentPosition($prospectiveDescendant);
    return !!(
      relationship & $prospectiveParent.DOCUMENT_POSITION_CONTAINED_BY || relationship === 0
    );
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
    invertPxString: invertPxString,
    isHighDpr: isHighDpr,
    uniqueIds: uniqueIds,
    updateElementTranslate: updateElementTranslate,
  };

};
