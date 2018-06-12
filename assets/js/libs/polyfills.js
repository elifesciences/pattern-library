'use strict';

require('core-js/es6/promise');
require('core-js/es6/set');
require('core-js/fn/object/assign');
require('core-js/fn/symbol');
require('core-js/fn/symbol/iterator');

module.exports = (function polyfills() {

  (function () {

    const ElementProto = window.Element.prototype;

    if (typeof ElementProto.matches !== 'function') {
      ElementProto.matches = ElementProto.msMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.webkitMatchesSelector || function matches(selector) {
        var element = this;
        var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
        var index = 0;

        while (elements[index] && elements[index] !== element) {
          ++index;
        }

        return Boolean(elements[index]);
      };
    }

    if (typeof ElementProto.closest !== 'function') {
      ElementProto.closest = function closest(selector) {
        var element = this;

        while (element && element.nodeType === 1) {
          if (element.matches(selector)) {
            return element;
          }

          element = element.parentNode;
        }

        return null;
      };
    }

    function CustomEvent(event, params) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    if ( typeof window.CustomEvent !== "function" ) {

      CustomEvent.prototype = window.Event.prototype;

      window.CustomEvent = CustomEvent;
    }

  })();

}());
