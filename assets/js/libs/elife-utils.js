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
          return $parent.querySelector(attachBefore);

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

      constructor() {
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
   * Simple XHR implementation for getting JSON data.
   *
   * @param url
   * @returns {Promise}
   */
  function loadData(url) {
    return new Promise(
        function resolver(resolve, reject) {
          let xhr = new XMLHttpRequest();
          xhr.addEventListener('load', () => {
            resolve(xhr.responseText);
          });
          xhr.addEventListener('error', reject);
          xhr.open('GET', url);
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.send();
        }
    );
  }

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

    function calcOffset(value) {
      if (!value) {
        return '0px';
      }

      if (typeof value === 'number') {
        return value + 'px';
      }

      if (typeof value === 'string') {
        value += 'px';
        return value.replace(/((px)+)$/, 'px');
      }
    }

    let offsetX = calcOffset(offset[0]);
    let offsetY = calcOffset(offset[1]);

    let props = ['webkitTransform', 'mozTransform', 'msTransform', 'oTransform', 'transform'];
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
   * @param operation
   * @returns {string} The modified value, as a string, e.g.: '105px'
   */
  function adjustPxString(pxString, adjustment, requestedOperation) {
    let originalSize = _getValueFromPxString(pxString);
    let adjustedSize = originalSize;
    let operation = 'add';
    if (['subtract', 'multiply', 'divide'].indexOf(requestedOperation) > -1) {
      operation = requestedOperation;
    }

    switch (operation) {
      case 'add':
        adjustedSize = originalSize + adjustment;
        break;
      case 'subtract':
        adjustedSize = originalSize - adjustment;
        break;
      case 'multiply':
        adjustedSize = originalSize * adjustment;
        break;
      case 'divide':
        adjustedSize = originalSize / adjustment;
        break;
      default:
        break;
    }
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
   * Debounce
   */
  function debounce(callback, wait, context = this) { // jshint ignore:line
    let timeout = null;
    let callbackArgs = null;

    const later = () => callback.apply(context, callbackArgs);

    return function () {
      callbackArgs = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Closest parent
   * Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
   * @param el
   * @param s
   * @returns {*}
   */
  function closest(el, s) {
    const matches = (el.document || el.ownerDocument).querySelectorAll(s);
    let i;
    do {
      i = matches.length;

      // jscs:disable disallowEmptyBlocks
      while (--i >= 0 && matches.item(i) !== el) {} // jshint ignore:line

      // jscs:enable disallowEmptyBlocks
    } while ((i < 0) && (el = el.parentElement));

    return el;
  }

  /**
   * Given an element it will return the sibling number it is.
   * @param $child
   * @returns {number}
   */
  function nthChild($child) {
    let siblings = 0;
    while ($child !== null) {
      if ($child.nodeType !== 8) {
        siblings += 1;
      }

      $child = $child.previousSibling;
    }

    return siblings;
  }

  function loadJavaScript(uri, integrity = null) {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script');

      script.src = uri;
      if (integrity) {
        script.integrity = integrity;
        script.crossOrigin = 'anonymous';
      }

      script.addEventListener('load', () => {
        resolve(script);
      }, false);

      script.addEventListener('error', () => {
        reject(script);
      }, false);

      document.body.appendChild(script);
    });
  }

  function loadStyleSheet(uri, integrity = null) {
    return new Promise(function (resolve, reject) {
      let link = document.createElement('link');

      link.setAttribute('rel', 'stylesheet');
      link.href = uri;
      if (integrity) {
        link.integrity = integrity;
        link.crossOrigin = 'anonymous';
      }

      link.addEventListener('load', function () {
        resolve(link);
      }, false);

      link.addEventListener('error', function () {
        reject(link);
      }, false);

      document.head.appendChild(link);
    });
  }

  /**
   * Deferred promise
   */
  function defer() {
    const result = {};
    result.promise = new Promise(function (resolve, reject) {
      result.resolve = function (value) {
        resolve(value);
      };

      result.reject = function (value) {
        reject(value);
      };

    });

    return result;
  }

  /**
   * Flattens nested array
   * @param input
   * @returns {Array.<*>}
   */
  function flatten(input) {
    return [].concat(...input);
  }

  const extend = (function () {
    if (typeof Object.assign === 'function') {
      return Object.assign;
    }

    return function (target) {
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      const output = Object(target);
      for (let i = 1; i < arguments.length; i) {
        const src = arguments[i];
        if (src === undefined || src === null) {
          continue;
        }

        for (let nextKey in src) {
          if (src.hasOwnProperty(nextKey)) {
            output[nextKey] = src[nextKey];
          }
        }

      }

      return output;
    };
  })();

  function eventCreator(name, detail) {
    let event;
    try {
      event = new CustomEvent(name, { detail });
    } catch (e) {
      // CustomEvent not supported, do it the old fashioned way
      event = document.createEvent(name);
      event.initCustomEvent(name, true, true, { detail });
    }

    return event;
  }

  function create$pageOverlay($parent, $followingSibling, id) {
    // element already exists
    if (document.querySelector(`#${id}`)) {
      return;
    }

    const $overlay = buildElement('div', ['overlay', 'hidden'], '', $parent, $followingSibling);
    if (id) {
      $overlay.id = id;
    }

    return $overlay;
  }

  return {
    adjustPxString: adjustPxString,
    areElementsNested: areElementsNested,
    buildElement: buildElement,
    closest: closest,
    create$pageOverlay: create$pageOverlay,
    debounce: debounce,
    eventCreator: eventCreator,
    loadJavaScript: loadJavaScript,
    loadStyleSheet: loadStyleSheet,
    defer: defer,
    extend: extend,
    flatten: flatten,
    invertPxString: invertPxString,
    loadData: loadData,
    nthChild: nthChild,
    uniqueIds: uniqueIds,
    updateElementTranslate: updateElementTranslate,
  };

};
