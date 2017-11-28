'use strict';

require('./libs/polyfills');

// Base level of feature support needed for the js loaded in this file.
// Consider AJAXing in the rest if the test passes.
if (window.localStorage && document.querySelector &&
       window.addEventListener && !!(document.createElement('div')).dataset) {

  document.querySelector('html').classList.add('js');

  let Components = {};

  // import modules into the list of Components.
  Components.AboutProfiles = require('./components/AboutProfiles');
  Components.ArticleDownloadLinksList = require('./components/ArticleDownloadLinksList');
  Components.ArticleSection = require('./components/ArticleSection');
  Components.AssetNavigation = require('./components/AssetNavigation');
  Components.AssetViewer = require('./components/AssetViewer');
  Components.AudioPlayer = require('./components/AudioPlayer');
  Components.Carousel = require('./components/Carousel');
  Components.ContentHeader = require('./components/ContentHeader');
  Components.DelegateBehaviour = require('./components/DelegateBehaviour');
  Components.FilterPanel = require('./components/FilterPanel');
  Components.FragmentHandler = require('./components/FragmentHandler');
  Components.Highlights = require('./components/Highlights');
  Components.HypothesisOpenerAffordance = require('./components/HypothesisOpenerAffordance');
  Components.LoginControl = require('./components/LoginControl');
  Components.MainMenu = require('./components/MainMenu');
  Components.Math = require('./components/Math');
  Components.MediaChapterListingItem = require('./components/MediaChapterListingItem');
  Components.Metrics = require('./components/Metrics');
  Components.Pager = require('./components/Pager');
  Components.Popup = require('./components/Popup');
  Components.SearchBox = require('./components/SearchBox');
  Components.SectionListingLink = require('./components/SectionListingLink');
  Components.SelectNav = require('./components/SelectNav');
  Components.SideBySideView = require('./components/SideBySideView');
  Components.SiteHeader = require('./components/SiteHeader');
  Components.ToggleableCaption = require('./components/ToggleableCaption');
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

    function initialiseComponent($component, inputBehaviour=null) {
      let behaviour = inputBehaviour ? inputBehaviour : $component.getAttribute('data-behaviour');

      // When present, data-behaviour contains a space-separated list of handlers for that component
      let handlers = behaviour.trim().split(' ');
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

      $component.dataset.behaviourInitialised = true;
    }

    Components.DelegateBehaviour.setInitialiseComponent(initialiseComponent);

    let components = document.querySelectorAll('[data-behaviour]');
    if (components) {
      [].forEach.call(components, (el) => initialiseComponent(el));
    }

    if ('MutationObserver' in window) {
      let observer = new MutationObserver(() => {
        let components = document.querySelectorAll('[data-behaviour]:not([data-behaviour-initialised])');
        if (components) {
          [].forEach.call(components, (el) => initialiseComponent(el));
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  };

  new Elife();
}

