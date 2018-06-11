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
      CommonHTML: {
        linebreaks: { automatic: true, width: '75% container' }
      },
      'fast-preview': { disabled: true },
      'HTML-CSS': {
        linebreaks: { automatic: true, width: '75% container' }
      },
      SVG: {
        linebreaks: { automatic: true, width: '75% container' }
      },
    };
  }

  static setupResizeHandler() {
    window.MathJax.Hub.Config(
      {
        'HTML-CSS': {
          linebreaks: { automatic: true, width: '75% container' },

          // Required when using Noto Serif as body font, for other fonts YMMMV.
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

              // Don't scale up if any the following applies:
              return !(

                // IE
                Browser.isMSIE ||

                // Chrome or Safari on a Mac
                Browser.isMac && (
                  Browser.isChrome || Browser.isSafari
                ) ||

                // Firefox not on a Mac or PC (targeting Linux & mobile)
                Browser.isFirefox && (!(Browser.isMac || Browser.isPC)) ||

                // Some smaller browsers e.g. Brave are have the name "unknown" . (Note that
                // although both Brave and Yandex browsers are based on Chromium and use Blink
                // rendering, Yandex identifies as "Chrome".)
                Browser.name === 'unknown'
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
    script.type = 'text/javascript';
    script.addEventListener('load', Math.setupResizeHandler);
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=MML_HTMLorMML';
    script.integrity = 'sha384-Ra6zh6uYMmH5ydwCqqMoykyf1T/+ZcnOQfFPhDrp2kI4OIxadnhsvvA2vv9A7xYv';
    script.crossOrigin = 'anonymous';
    doc.querySelector('body').appendChild(script);
  }

};
