'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class CheckPMC {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    this.window = _window;
    this.doc = doc;
    this.$elm = $elm;

    const checkUrl = this.$elm.dataset.checkAvailable;
    const display = this.$elm.dataset.displayOnAvailable;

    // The next XHR
    this.currentRequest = this.checkPMC(checkUrl);

    this.checkPMC(checkUrl)
      .then(foo => {
        console.log('mock::first-promise');
        return foo;
      })
      .then(data => JSON.parse(data))
      .then(foo => {
        console.log('mock::parse-json');
        return foo;
      })
      .then(pmc => ('pmcid' in pmc.records[0]))
      .then(foo => {
        console.log('mock::check-for-pmcid', foo);
        return foo;
      })
      .then(pmc => {
        console.log('mock::promise-callback', pmc);
        if (pmc) {
          console.log('mock::expanding-element');
          utils.expandElement(
            (new DOMParser().parseFromString(display, 'text/html')).documentElement.querySelector('body').firstChild,
            '',
            '',
            this.$elm.parentNode,
            this.$elm
          );
          this.$elm.remove();
        } else {
          console.log('mock::removing-element');
          this.$elm.parentNode.remove();
        }
      });
  }

  checkPMC(url) {
    return utils.loadData(url);
  }

};
