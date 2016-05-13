'use strict';

// Base level of feature support needed for the js loaded in this file.
// Consider AJAXing in the rest if the test passes.
if (window.localStorage && document.querySelector &&
       window.addEventListener && !!(document.createElement('div')).classList) {

  document.querySelector('html').classList.add('js');

  let Components = {};

  // import modules into the list of Components.
  Components.ArticleDownloadLinksList = require('./components/ArticleDownloadLinksList');
  Components.AudioPlayer = require('./components/AudioPlayer');
  Components.ContentHeaderArticle = require('./components/ContentHeaderArticle');
  Components.ContentHeaderSelectNav = require('./components/ContentHeaderSelectNav');
  Components.MainMenu = require('./components/MainMenu');
  Components.SiteHeader = require('./components/SiteHeader');
  Components.SearchBox = require('./components/SearchBox');
  Components.ViewerModal = require('./components/ViewerModal');

  // App
  let Elife = function Elife() {

    // get all the components on the current page
    let components = document.querySelectorAll('[data-behaviour]');

    if (components.length) {

      for (let i = 0; i < components.length; i += 1) {
        let $elm = components[i];
        let handler = $elm.getAttribute('data-behaviour');

        // Is there a handler?
        // Is it a function?
        if (Components[handler] && typeof Components[handler] === 'function') {
          new Components[handler]($elm, window, window.document);
        }

      }
    }
  };

  new Elife();
}
