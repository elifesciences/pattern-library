'use strict';

module.exports = class Twitter {

  constructor($elm, _window = window, doc = document) {
    this.window = _window;
    this.isSingleton = true;

    Twitter.init(doc);
  }

  static init(doc) {
    Twitter.loadDependencies(doc);
    if ('MutationObserver' in window) {
      if (!Twitter.dependenciesAlreadySetup(doc)) {
        let observer = new MutationObserver((mutations, observer) => {
          Twitter.loadDependencies(doc);
          if (Twitter.dependenciesAlreadySetup(doc)) {
            observer.disconnect();
          }
        });
        observer.observe(doc.body, { childList: true, subtree: true });
      }
    }
  }

  static loadDependencies(doc) {
    if (doc.querySelector('blockquote[class*="twitter-tweet"]')) {
      Twitter.load(doc);
    }
  }

  static dependenciesAlreadySetup(doc) {
    return !!doc.querySelector('script[src*="twitter"]');
  }

  static load(doc) {
    let script = doc.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://platform.twitter.com/widgets.js';
    script.charset = 'utf-8';
    doc.querySelector('body').appendChild(script);
  }

};
