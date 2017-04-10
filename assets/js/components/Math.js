'use strict';

module.exports = class Math {

  constructor($elm, _window = window, doc = document) {
    this.window = _window;
    Math.loadDependencies(doc);
  }

  static loadDependencies(doc) {
    if (!Math.dependenciesAlreadySetup(doc)) {
      Math.setupProperties();
      Math.load(doc);
    }
  }

  static dependenciesAlreadySetup(doc) {
    return !!doc.querySelector('script[src*="mathjax"]');
  }

  static setupProperties() {
    window.MathJax = {
      'HTML-CSS': {
        linebreaks: { automatic: true, width: '75% container' }
      },
      SVG: {
        linebreaks: { automatic: true, width: '75% container' }
      }
    };
  }

  static setupResizeHandler() {
    let resizeTimeout;
    let resizeThrottler = function resizeThrottler() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function () {
          resizeTimeout = null;

          // TODO: change so exactly one rerender regardless of number of Math instances.
          // Consider tacking at the same time as fragment handler.
          if (!!this.window.MathJax) {
            this.window.MathJax.Hub.Queue(['Rerender', this.window.MathJax.Hub]);
          }
        }, 300);
      }
    };

    window.addEventListener('resize', resizeThrottler);
  }

  static load(doc) {
    let script = doc.createElement('script');
    script.type = 'text/javascript';
    script.addEventListener('load', Math.setupResizeHandler);
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=MML_HTMLorMML';
    script.integrity = 'sha384-crwIf/BuaWM9rM65iM+dWFldgQ1Un8jWZMuh3puxb8TOY9+linwLoI7ZHZT+aekW';
    script.crossOrigin = 'anonymous';
    doc.querySelector('body').appendChild(script);
  }

};
