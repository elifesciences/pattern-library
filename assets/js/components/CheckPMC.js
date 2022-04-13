'use strict';

const utils = require('../libs/elife-utils')();

module.exports = class CheckPMC {

  constructor($elm) {
    this.$elm = $elm;

    const checkUrl = this.$elm.dataset.checkAvailable;
    const display = this.$elm.dataset.displayOnAvailable;

    this.checkPMC(checkUrl)
      .then(pmc => {
        if (pmc) {
          this.$elm.insertAdjacentHTML('beforebegin', display);
          this.$elm.remove();
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
