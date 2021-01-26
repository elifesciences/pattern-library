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

    window.MathJax = {
      chtml: {
        scale: 1.04,                  // global scaling factor for all expressions
        minScale: 1,                  // smallest scaling factor to use
        matchFontHeight: true,        // true to match ex-height of surrounding font
        mtextInheritFont: false,       // true to make mtext elements use surrounding font
        merrorInheritFont: false,      // true to make merror text use surrounding font
        mtextFont: '',                 // font to use for mtext, if not inheriting (empty means use MathJax fonts)
        merrorFont: 'serif',           // font to use for merror, if not inheriting (empty means use MathJax fonts)
        mathmlSpacing: false,          // true for MathML spacing rules, false for TeX rules
        skipAttributes: {},           // RFDa and other attributes NOT to copy to the outputß
        displayIndent: '0',           // default for indentshift when set to 'auto'
        cssStyles: null
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
