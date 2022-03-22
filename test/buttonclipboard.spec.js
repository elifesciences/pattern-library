const chai = require('chai');
const sinon = require('sinon');
const utils = require('../assets/js/libs/elife-utils')();

const expect = chai.expect;

// load in component(s) to be tested
const ButtonClipboard = require('../assets/js/components/ButtonClipboard');

describe('A button can be used to store text in clipboard', () => {
  'use strict';

  let $elm = document.querySelector('[data-behaviour="ButtonClipboard"]');
  let $modal = document.querySelector('.modal');
  let $clipboardText;
  let $btnClipboard;

  beforeEach(() =>  {
    $clipboardText = '';
    $btnClipboard = new ButtonClipboard($elm, window, window.document);
    sinon.stub($btnClipboard, 'supportsClipboardAPI').callsFake(() => false);
  });

  it('changes button when clipboard triggered', () => {
    sinon.stub($btnClipboard, 'copyToClipboardFallback').callsFake((text) => {
      $clipboardText = text;
    });
    expect($elm.textContent).to.equal('Button clipboard');
    expect($elm.classList.contains('button--success')).to.be.false;
    expect($clipboardText).to.be.empty;
    $elm.click();
    expect($elm.textContent).to.equal('Copied!');
    expect($elm.classList.contains('button--success')).to.be.true;
    expect($clipboardText).to.equal('Text to store in clipboard');
  });

  it('disables button if copy fails', () => {
    expect($elm.classList.contains('button--fail')).to.be.false;
    expect($elm.disabled).to.be.false;
    sinon.stub($btnClipboard, 'copyToClipboardFallback').callsFake((text) => {
      throw new Error('copy failed');
    });
    $elm.click();
    expect($elm.textContent).to.equal('Copy not supported');
    expect($elm.classList.contains('button--fail')).to.be.true;
    expect($elm.disabled).to.be.true;
  });

  it('resets button when modalWindowClose triggered', () => {
    sinon.stub($btnClipboard, 'copyToClipboardFallback').callsFake((text) => {
      $clipboardText = text;
    });
    expect($elm.textContent).to.equal('Button clipboard');
    expect($elm.classList.contains('button--success')).to.be.false;
    $elm.click();
    expect($elm.textContent).to.equal('Copied!');
    expect($elm.classList.contains('button--success')).to.be.true;
    $modal.dispatchEvent(utils.eventCreator('modalWindowClose'));
    expect($elm.textContent).to.equal('Button clipboard');
    expect($elm.classList.contains('button--success')).to.be.false;
  });

});
