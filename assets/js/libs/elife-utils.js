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

  return {
    buildElement: buildElement,
    uniqueIds: uniqueIds,
  };

};
