'use strict';

require('core-js/es6/promise');
require('core-js/es6/set');
require('core-js/fn/object/assign');
require('core-js/fn/symbol');
require('core-js/fn/symbol/iterator');
require('element-closest');

module.exports = (function polyfills() {

  (function () {

    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent ( event, params ) {
      params = params || { bubbles: false, cancelable: false, detail: undefined };
      var evt = document.createEvent( 'CustomEvent' );
      evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
  })();

}());
