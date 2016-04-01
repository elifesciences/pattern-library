
let Components = {};

// import modules into the list of Components.
Components.AudioPlayer = require('./components/AudioPlayer');
Components.SearchBox = require('./components/SearchBox');
Components.ViewerModal = require('./components/ViewerModal');

// App
function Elife() {

  // get all the components on the current page
  let components = document.querySelectorAll('[data-behaviour]');

  if (components.length) {

    for (let i = 0; i < components.length; i++) {
      let $elm = components[i];
      let handler = $elm.getAttribute('data-behaviour');

      // Is there a handler?
      // Is it a function?
      if (Components[handler] && typeof Components[handler] === 'function') {
        new Components[handler]($elm);
      }

    };
  }
};

// run!
new Elife();
