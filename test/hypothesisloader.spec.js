const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;
const spy = sinon.spy;

const HypothesisLoader = require('../assets/js/components/HypothesisLoader');

describe('A HypothesisLoader Component', function () {
  'use strict';

  let $elm;
  let loader;

  beforeEach(() => {
    $elm = document.querySelector('[data-behaviour="HypothesisLoader"]');
    loader = new HypothesisLoader($elm);
  });

  it('is a singleton', () => {
    expect(loader.isSingleton).to.be.true;
  });

  it('by default loads from the endpoint https://hypothes.is/embed.js', () => {
    expect(HypothesisLoader.setScriptSource($elm)).to.equal('https://hypothes.is/embed.js');
  });

  describe('handling load failure', () => {

    beforeEach(() => {
      if (typeof $elm.dataset.hypothesisEmbedLoadStatus !== 'undefined') {
        delete $elm.dataset.hypothesisEmbedLoadStatus;
      }
    });

    it('sets the data attribute hypothesis-embed-load-status to "failed" on its own element', () => {
      loader.handleError();
      expect($elm.dataset.hypothesisEmbedLoadStatus).to.equal('failed');
    });

    it('emits a loaderror event with the message "Hypothesis embed load failed"', () => {
      spy($elm, 'dispatchEvent');

      loader.handleError();

      expect($elm.dispatchEvent.calledOnce).is.true;

      const callArgs = $elm.dispatchEvent.getCall(0).args;
      expect(callArgs).to.have.lengthOf(1);
      const callArg = callArgs[0];
      expect(callArg).to.be.an.instanceOf(ErrorEvent);
      expect(callArg.type).to.equal('loaderror');
      expect(callArg.message).to.equal('Hypothesis embed load failed');

      $elm.dispatchEvent.restore();
    });

  });

});
