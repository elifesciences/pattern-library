const chai = require('chai');
const sinon = require('sinon');
const utils = require('../assets/js/libs/elife-utils')();

const expect = chai.expect;

// load in component(s) to be tested
const ButtonClipboard = require('../assets/js/components/ButtonClipboard');

describe('A button can be used to store text in clipboard', () => {
  'use strict';

  let $elm = document.querySelector('.first');
  let $elmModal = document.querySelector('.second');
  let $modal = document.querySelector('.modal');
  let $clipboardText;
  let $btnClipboard;
  let $btnClipboardModal;

  beforeEach(() => {
    $clipboardText = '';
    $btnClipboard = new ButtonClipboard($elm, window, window.document);
    $btnClipboardModal = new ButtonClipboard($elmModal, window, window.document);
    sinon.stub($btnClipboard, 'supportsClipboardAPI').callsFake(() => false);
    sinon.stub($btnClipboardModal, 'supportsClipboardAPI').callsFake(() => false);
  });

  it('changes button when clipboard triggered', () => {
    sinon.stub($btnClipboard, 'copyToClipboardFallback').callsFake(text => {
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
    sinon.stub($btnClipboard, 'copyToClipboardFallback').callsFake(() => {
      throw new Error('copy failed');
    });
    $elm.click();
    expect($elm.textContent).to.equal('Copy not supported');
    expect($elm.classList.contains('button--fail')).to.be.true;
    expect($elm.disabled).to.be.true;
  });

  it('resets button when modalWindowClose triggered', () => {
    sinon.stub($btnClipboardModal, 'copyToClipboardFallback').callsFake(text => {
      $clipboardText = text;
    });
    expect($elmModal.textContent).to.equal('Button clipboard in modal');
    expect($elmModal.classList.contains('button--success')).to.be.false;
    $elmModal.click();
    expect($elmModal.textContent).to.equal('Copied!');
    expect($elmModal.classList.contains('button--success')).to.be.true;
    $modal.dispatchEvent(utils.eventCreator('modalWindowClose'));
    expect($elmModal.textContent).to.equal('Button clipboard in modal');
    expect($elmModal.classList.contains('button--success')).to.be.false;
  });

});
