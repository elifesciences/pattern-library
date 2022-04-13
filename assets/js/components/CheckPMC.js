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

    this.checkPMC(checkUrl)
      .then(pmc => {
        if (pmc) {
          this.$elm.parentNode.innerHTML = display;
        } else {
          this.$elm.parentNode.remove();
        }
      });
  }

  checkPMC(url) {
    return utils.loadData(url)
      .then(data => JSON.parse(data))
      .then(pmc => ('pmcid' in pmc.records[0]));
  }

};
