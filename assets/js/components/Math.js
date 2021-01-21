'use strict';

module.exports = class Math {

  constructor($elm, _window = window, doc = document) {
    this.window = _window;
    this.isSingleton = true;

    Math.init(doc);
  }

  static init(doc) {
    Math.loadDependencies(doc);
    if ('MutationObserver' in window) {
      if (!Math.dependenciesAlreadySetup(doc)) {
        let observer = new MutationObserver((mutations, observer) => {
          Math.loadDependencies(doc);
          if (Math.dependenciesAlreadySetup(doc)) {
            observer.disconnect();
          }
        });
        observer.observe(doc.body, { childList: true, subtree: true });
      }
    }
  }

  static loadDependencies(doc) {
    if (doc.querySelector('math')) {
      Math.setupProperties();
      Math.load(doc);
    }
  }

  static dependenciesAlreadySetup(doc) {
    return !!doc.querySelector('script[src*="mathjax"]');
  }

  static setupProperties() {
    window.MathJax = {
      loader: {
        load: ['ui/menu']
      }
    };
  }

  static load(doc) {
    let script = doc.createElement('script');
    script.id = 'MathJax-script';
    script.async = true;
    script.type = 'text/javascript';
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.0.5/es5/mml-chtml.js';
    doc.querySelector('head').appendChild(script);
  }

};
