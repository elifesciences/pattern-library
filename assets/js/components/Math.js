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
      },

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

  static setupResizeHandler() {
    window.MathJax.Hub.Config(
      {
        'HTML-CSS': {
          linebreaks: { automatic: true, width: '75% container' },

          // Required when using Noto Serif as body font, for other fonts YMMV.
          scale: (function () {

            // Noto Serif's ex height is marginally larger than the font it replaces. The slight
            // down scaling of the maths set in basicScaling (90%) tries to keep the equation size similar
            // to how it was with the previous font, in case line breaks within equations are significant.
            const basicScaling = 90;

            // Work around for a bug causing inconsistent maths sizing between browsers:
            // Some browsers display the maths legibly with the basic scaling, other browsers
            // require it to be scaled up.
            const upScaling = basicScaling * 2;

            function shouldBeScaledUp(Browser) {

              // Required because maths scales differently between iOS & Android platforms in Chrome
              // and Safari, and the MathJax API doesn't have a way of distinguishing the mobile OS.
              // Deliberately not made available as a utility: we don't want to encourage this!
              const isProbablyIOS = function () {
                return !!navigator.userAgent.match(/iPad|iPhone/);
              };

              // Don't scale up if any the following applies:
              return !(

                // IE
                Browser.isMSIE ||

                // Safari or Chrome on a Mac
                (Browser.isMac && (Browser.isSafari || Browser.isChrome)) ||

                // Safari or Chrome on iOS
                (isProbablyIOS() && Browser.isSafari) ||

                // Aiming to target Firefox on Linux & mobile
                (Browser.isFirefox && (!(Browser.isMac || Browser.isPC))) ||

                // Some smaller browsers e.g. Brave are identified as "Unknown" . (Although both
                // Brave and Yandex browsers are based on Chromium and use Blink rendering, Yandex
                // identifies as "Chrome".)
                Browser.toString() === 'Unknown'
              );
            }

            return shouldBeScaledUp(window.MathJax.Hub.Browser) ? upScaling : basicScaling;
          }())
        }
      }
    );
    this.currentClientWidth = document.body.clientWidth;
    let resizeTimeout;
    let resizeThrottler = function resizeThrottler() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function () {
          resizeTimeout = null;

          if (!!this.window.MathJax && this.currentClientWidth !== document.body.clientWidth) {
            this.currentClientWidth = document.body.clientWidth;
            this.window.MathJax.Hub.Queue(['Rerender', this.window.MathJax.Hub]);
          }
        }, 300);
      }
    };

    window.addEventListener('resize', resizeThrottler);
  }

  static load(doc) {
    let script = doc.createElement('script');
    script.id = 'MathJax-script';
    script.async = true;
    script.type = 'text/javascript';
    script.addEventListener('load', Math.setupResizeHandler);
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.1.2/es5/mml-chtml.min.js';
    script.integrity = 'sha512-b8NAh18dQ92jyOvBUzpEc+c+wcH+YkCSH4vcf2cKAKkBBWpFIFR/vpmsuFYnlr/cvcBhymHwnj6gb7RkAX0/Pg==';
    script.crossOrigin = 'anonymous';
    doc.querySelector('head').appendChild(script);
  }

};
