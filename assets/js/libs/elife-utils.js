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

    return Math.round(pxString.match(/([-0-9.]+)px/)[1]);
  }

  function _getZeroAwarePxStringFromValue(value) {
    if (value === 0) {
      return '' + value;
    }

    return value + 'px';
  }

  /**
   * Return an '[n]px' string, adjusting a base value by the amount and operation supplied.
   *
   * Examples:
   *  - adjustPxString('97px', 8) returns '105px'
   *  - adjustPxString('97px', 8, `subtract') returns '89px'
   *  - adjustPxString('100px', 20, 'divide') returns '5px'
   *  - adjustPxString('50px', 3, 'multiply') returns '150px'
   *
   * @param {String} pxString The string representing the original quantity, e.g. '97px'
   * @param {Number} adjustment The numeric adjustment to make, e.g. 8
   * @param {('add'|'subtract'|'multiply'|'divide')} requestedOperation
   * @returns {string} The modified value, e.g.: '105px'
   */
  function adjustPxString(pxString, adjustment, requestedOperation) {
    const originalSize = _getValueFromPxString(pxString);
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
   * Return the supplied value with the sign flipped, or '0' if supplied ` a zero px string
   *
   * For example: invertPxString('97px') returns '-97px'
   * For example: invertPxString('-97px') returns '97px'
   * For example: invertPxString('0px') returns '0'
   *
   * @param {String} pxString The string representing the original quantity, e.g. '97px'
   * @returns {string} The modified value, as a string, e.g.: '-97px'
   */
  function invertPxString(pxString) {
    const adjustedSize = _getValueFromPxString(pxString) * -1;
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
   * Indicates whether an HTML element with a given id is found as/within a specific chunk of html
   *
   * @param {String} id The id  of the HTML element to search for
   * @param {HTMLElement} $section The element to search/search within
   * @param {HTMLDocument} doc
   * @returns {boolean} true if element with id is $section, or is contained within $section
   */
  function isIdOfOrWithinSection(id, $section, doc) {
    if (id.search(/https?:\/\//) === 0) {
      return false;
    }

    if (id === $section.id) {
      return true;
    }

    const $fragWithId = doc.querySelector('#' + id);
    return areElementsNested($section, $fragWithId);
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
   * Returns the ordinal of an element's location within any siblings.
   * @param {HTMLElement} $el The element to assess the position of
   * @throws TypeError if the argument is not an HTMLElement
   * @returns {number}
   */
  function getOrdinalAmongstSiblingElements($el) {
    if ($el instanceof HTMLElement) {
      let position = 1;
      let previous = $el.previousElementSibling;
      while (previous) {
        position += 1;
        previous = previous.previousElementSibling;
      }

      return position;
    }

    throw new TypeError('Expected HTMLElement');
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
   * Flattens the upper most nested level of a nested array
   *
   * Examples:
   *  - flatten( [1,2,3,[4]] ) -> [1, 2, 3, 4]
   *  - flatten( [1,2,3,[4, [5]]] ) -> [1, 2, 3, 4, [5]]
   * @param {Array<*>} input
   * @returns {Array<*>} with one fewer level of nesting
   */
  function flatten(input) {
    return [].concat(...input);
  }

  function remoteDoc(url, window) {
    const current = window.location.href.split('#')[0];
    url = url.split('#')[0];

    if (url === current) {
      return Promise.resolve(window.document);
    }

    if (window.remoteDocuments === undefined) {
      window.remoteDocuments = {};
    }

    if (!(url in window.remoteDocuments)) {
      window.remoteDocuments[url] = loadData(url).then((data) => {
        let wrapper = window.document.createElement('div');
        wrapper.innerHTML = data;
        return wrapper;
      });
    }

    return window.remoteDocuments[url];
  }

  /**
   * Add CSS styling to DOM element.
   *
   * @param $el
   * @param styles
   * @returns {*}
   */
  function _addStylesToElement($el, styles) {
    for (let style in styles) {
      if (styles.hasOwnProperty(style)) {
        $el.style[style] = styles[style];
      }

    }

    return $el;
  }

  /**
   * Wrap elements in with various options.
   *
   * @param $el
   * @param tag
   * @param className
   * @param styles
   * @param fn
   * @returns {Element}
   */
  function wrapElements($el, tag, className, styles, fn) {
    const $children = Array.isArray($el) ? $el : [$el];
    const classNames = Array.isArray(className) ? className : [className];
    const $container = buildElement(tag, classNames);
    if (styles) {
      _addStylesToElement($container, styles);
    }

    $children.forEach(child => $container.appendChild(child));
    return fn ? fn($container) : $container;
  }

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

  /**
   * Jump to element on page.
   *
   * @param link
   */
  function jumpToAnchor(link) {
    if (history.replaceState) {
      window.location.href = link.href;
      history.replaceState(null, null, link.href);
    } else {
      const $el = document.getElementById(link.hash.slice(1));
      if ($el) {
        window.scrollTo(0, $el.offsetTop);
      }

    }

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

  /**
   *
   * Determines if the top of an element is within the viewport bounds
   *
   * @param {HTMLElement} $elm
   * @param {Document} doc
   * @param win
   * @returns {boolean} true if the top of the element is within the viewport bounds
   */
  function isTopInView($elm, doc, win) {
    const rect = $elm.getBoundingClientRect();
    const html = doc.documentElement;
    return (
      rect.top >= 0 &&
      rect.top <= (win.innerHeight || html.clientHeight) &&
      rect.left >= 0 &&
      rect.left <= (win.innerWidth || html.clientWidth)
    );
  }

  /**
   * Throttle a function to run with specified interval
   *
   * The function should be an arrow function to ensure scope is correct
   * @param {Function} fn The arrow function to throttle
   * @param {Number} thresholdInMs The minimum interval between calls to the thottled function
   * @returns {Function}
   */
  function throttle(fn, thresholdInMs = 250) {
    let last;
    let deferTimer;
    return function () {
      const now = +new Date();
      const args = arguments;
      if (last && now < last + thresholdInMs) {

        // hold on to it
        window.clearTimeout(deferTimer);
        deferTimer = window.setTimeout(function () {
          last = now;
          fn.apply(null, args);
        }, thresholdInMs);
      } else {
        last = now;
        fn.apply(null, args);
      }
    };
  }

  return {
    adjustPxString: adjustPxString,
    areElementsNested: areElementsNested,
    isIdOfOrWithinSection: isIdOfOrWithinSection,
    buildElement: buildElement,
    closest: closest,
    create$pageOverlay: create$pageOverlay,
    debounce: debounce,
    eventCreator: eventCreator,
    loadJavaScript: loadJavaScript,
    loadStyleSheet: loadStyleSheet,
    defer: defer,
    flatten: flatten,
    invertPxString: invertPxString,
    isTopInView: isTopInView,
    jumpToAnchor: jumpToAnchor,
    loadData: loadData,
    getOrdinalAmongstSiblingElements: getOrdinalAmongstSiblingElements,
    remoteDoc: remoteDoc,
    throttle: throttle,
    uniqueIds: uniqueIds,
    updateElementTranslate: updateElementTranslate,
    wrapElements: wrapElements,
  };
};
