'use strict';

// Base level of feature support needed for the js loaded in this file.
// Consider AJAXing in the rest if the test passes.
if (window.localStorage && document.querySelector &&
       window.addEventListener && !!(document.createElement('div')).classList) {

  document.querySelector('html').classList.add('js');

  let Components = {};

  // import modules into the list of Components.
  Components.ArticleSection = require('./components/ArticleSection');
  Components.ArticleDownloadLinksList = require('./components/ArticleDownloadLinksList');
  Components.AudioPlayer = require('./components/AudioPlayer');
  Components.ContentHeaderArticle = require('./components/ContentHeaderArticle');
  Components.BackgroundImage = require('./components/BackgroundImage');
  Components.SelectNav = require('./components/SelectNav');
  Components.MainMenu = require('./components/MainMenu');
  Components.MediaChapterListingItem = require('./components/MediaChapterListingItem');
  Components.SiteHeader = require('./components/SiteHeader');
  Components.SearchBox = require('./components/SearchBox');
  Components.ViewerModal = require('./components/ViewerModal');
  Components.ViewSelector = require('./components/ViewSelector');

  // App
  let Elife = function Elife() {

    function initialiseComponent($component) {
      // When present, data-behaviour contains a space-separated list of handlers for that component
      let handlers = $component.getAttribute('data-behaviour').trim().split(' ');
      for (let i = 0; i < handlers.length; i += 1) {
        let handler = handlers[i];
        if (Components[handler] && typeof Components[handler] === 'function') {
          new Components[handler]($component, window, window.document);
        }
      }
    }

    let components = document.querySelectorAll('[data-behaviour]');
    if (components) {
      [].forEach.call(components, initialiseComponent);
    }

  };

  new Elife();
}

window.MathJax = {
  "HTML-CSS": {
    linebreaks: { automatic: true, width: "75% container" }
  },
  "SVG": {
    linebreaks: { automatic: true, width: "75% container" }
  }
};

(function () {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src  = "https://cdn.mathjax.org/mathjax/2.7-latest/MathJax.js?config=MML_HTMLorMML";
  document.getElementsByTagName("head")[0].appendChild(script);
})();

(function() {
  window.addEventListener("resize", resizeThrottler, false);
  var resizeTimeout;
  function resizeThrottler() {
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        MathJax.Hub.Queue(["Rerender",MathJax.Hub]);
      }, 300);
    }
  }
}());
