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
            // On Mac, Webkit/Blink browsers, and on PC, IE11 (other IE not tested) display the maths
            // legibly; other browsers on Mac & PC require it scaled up.
            // TODO: check Linux.
            const upScaling = basicScaling * 2;

            function shouldBeScaledUp(Browser) {
              return !(
                Browser.isMSIE ||
                Browser.isMac && (
                Browser.isChrome || Browser.isSafari
                )
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
