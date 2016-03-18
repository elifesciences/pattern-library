"use strict";

// import components
const DropDown = require('./components/example');

let Components = {};
Components.DropDown = DropDown;

// App
function Elife() {

  let components = document.querySelectorAll('[data-behaviour]');

  if( components.length ) {

    for (let i = 0; i < components.length; i++) {
      let elm = components[i];
      let handler = elm.getAttribute('data-behaviour');

      // Is there a handler?
      // Is it a function?
      if (Components[handler] && typeof Components[handler] === 'function') {
        new Components[handler](elm);
      }

    };
  }
};

// run!
new Elife();
