'use strict';

require('./libs/polyfills');

document.querySelector('html').classList.add('js');

let Components = {};
let UnsafeComponents = {};

// import modules into the list of Components.
Components.AboutProfiles = require('./components/AboutProfiles');
Components.AnnotationTeaser = require('./components/AnnotationTeaser');
Components.ArticleDownloadLinksList = require('./components/ArticleDownloadLinksList');
UnsafeComponents.ArticleSection = require('./components/ArticleSection'); // unsafe, references to MathJAX, loaded from cloudflare
Components.AssetNavigation = require('./components/AssetNavigation');
UnsafeComponents.AssetViewer = require('./components/AssetViewer'); // unsafe, loads PhotoSwipeUI from cloudflare
Components.AudioPlayer = require('./components/AudioPlayer');
Components.Authors = require('./components/Authors');
Components.ButtonClipboard = require('./components/ButtonClipboard');
Components.CallToAction = require('./components/CallToAction');
Components.CheckPMC = require('./components/CheckPMC');
Components.ContentAside = require('./components/ContentAside');
Components.DelegateBehaviour = require('./components/DelegateBehaviour');
Components.FilterPanel = require('./components/FilterPanel');
Components.FragmentHandler = require('./components/FragmentHandler');
Components.HiddenUntilChecked = require('./components/HiddenUntilChecked');
Components.Highlights = require('./components/Highlights');
UnsafeComponents.HypothesisLoader = require('./components/HypothesisLoader'); // unsafe, calls https://hypothes.is/embed.js
UnsafeComponents.HypothesisOpener = require('./components/HypothesisOpener'); // unsafe, depends on hypothesis
UnsafeComponents.HypothesisTrigger = require('./components/HypothesisTrigger'); // unsafe, depends on hypothesis
Components.InfoBar = require('./components/InfoBar');
Components.JumpMenu = require('./components/JumpMenu');
Components.LoginControl = require('./components/LoginControl');
Components.MainMenu = require('./components/MainMenu');
UnsafeComponents.Math = require('./components/Math'); // unsafe, loads mathjax from cloudflare
Components.MediaChapterListingItem = require('./components/MediaChapterListingItem');
Components.Metrics = require('./components/Metrics');
Components.Modal = require('./components/Modal');
Components.Pager = require('./components/Pager');
Components.PersonalisedCoverDownload = require('./components/PersonalisedCoverDownload');
Components.Popup = require('./components/Popup');
Components.SearchBox = require('./components/SearchBox');
Components.SectionListingLink = require('./components/SectionListingLink');
Components.SelectNav = require('./components/SelectNav');
Components.SideBySideView = require('./components/SideBySideView');
Components.SiteHeader = require('./components/SiteHeader');
Components.SpeechBubble = require('./components/SpeechBubble');
Components.TabbedNavigation = require('./components/TabbedNavigation');
UnsafeComponents.ToggleableCaption = require('./components/ToggleableCaption'); // unsafe, depends on Mathjax
UnsafeComponents.Twitter = require('./components/Twitter'); // unsafe, calls https://platform.twitter.com/widgets.js
Components.ViewerModal = require('./components/ViewerModal');
Components.ViewSelector = require('./components/ViewSelector');

// App
function Elife() {

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

  function initialiseComponentList($componentList) {
    if (componentList) {
      [].forEach.call(componentList, (el) => initialiseComponent(el));
    }
  }

  function findAndInitialiseComponentList() {
    initialiseComponentList(document.querySelectorAll('[data-behaviour]'));
    if ('MutationObserver' in window) {
      let observer = new MutationObserver(() => {
        initialiseComponentList(document.querySelectorAll('[data-behaviour]:not([data-behaviour-initialised])'));
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }

  this.initialiseUnsafeComponentList = function () {
    for (let key in UnsafeComponents) {
      Components[key] = UnsafeComponents[key];
    }

    findAndInitialiseComponentList();
  };

  // init the safe components
  findAndInitialiseComponentList();

  // later, once visitor has consented, we can do this:
  // foo.bar.Elife.initialiseUnsafeComponentList()
};

let Elife = new Elife();

