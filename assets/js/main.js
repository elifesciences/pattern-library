'use strict';

// Babel polyfill
require('babel-polyfill');

// Base level of feature support needed for the js loaded in this file.
// Consider AJAXing in the rest if the test passes.
if (window.localStorage && document.querySelector &&
       window.addEventListener && !!(document.createElement('div')).classList) {

  document.querySelector('html').classList.add('js');

  let Components = {};

  // import modules into the list of Components.
  Components.ArticleDownloadLinksList = require('./components/ArticleDownloadLinksList');
  Components.ArticleSection = require('./components/ArticleSection');
  Components.AudioPlayer = require('./components/AudioPlayer');
  Components.BackgroundImage = require('./components/BackgroundImage');
  Components.Carousel = require('./components/Carousel');
  Components.ContentHeaderArticle = require('./components/ContentHeaderArticle');
  Components.FragmentHandler = require('./components/FragmentHandler');
  Components.MainMenu = require('./components/MainMenu');
  Components.Math = require('./components/Math');
  Components.MediaChapterListingItem = require('./components/MediaChapterListingItem');
  Components.Metrics = require('./components/Metrics');
  Components.Pager = require('./components/Pager');
  Components.SearchBox = require('./components/SearchBox');
  Components.SectionListingLink = require('./components/SectionListingLink');
  Components.SelectNav = require('./components/SelectNav');
  Components.SiteHeader = require('./components/SiteHeader');
  Components.ViewerModal = require('./components/ViewerModal');
  Components.ViewSelector = require('./components/ViewSelector');

  // App
  let Elife = function Elife() {

    let singletons = (function () {
      let registered = [];

      function isRegistered(componentName) {
        return registered.indexOf(componentName) > -1;
      }

      function register(componentName) {
        registered.push(componentName);
      }

      return {
        isRegistered: isRegistered,
        register: register,
      };

    }());

    function initialiseComponent($component) {
      // When present, data-behaviour contains a space-separated list of handlers for that component
      let handlers = $component.getAttribute('data-behaviour').trim().split(' ');
      handlers.forEach(function (handler) {
        if (!singletons.isRegistered(handler)) {
          if (!!Components[handler] && typeof Components[handler] === 'function') {
            new Components[handler]($component, window, window.document);
            if (Components[handler].isSingleton) {
              singletons.register(handler);
            }
          }
        }
      });
    }

    let components = document.querySelectorAll('[data-behaviour]');
    if (components) {
      [].forEach.call(components, initialiseComponent);
    }

  };

  new Elife();
}

