const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;

// load in component(s) to be tested
const ButtonClipboard = require('../assets/js/components/ButtonClipboard');

describe('A button can be used to store text in clipboard', () => {
  'use strict';

  let $elm;
  let $clipboardText;

  beforeEach(() =>  {
    $elm = document.querySelector('[data-behaviour="ButtonClipboard"]');
    $clipboardText = '';
    const btnClipboard = new ButtonClipboard($elm, window, window.document);
    sinon.stub(btnClipboard, 'supportsClipboardAPI').callsFake(() => false);
    sinon.stub(btnClipboard, 'copyToClipboardFallback').callsFake((text, onSuccess) => {
        $clipboardText = text;
        onSuccess();
    });
  });

  it('changes button when clipboard triggered', () => {
    expect($elm.textContent).to.equal('Button clipboard');
    expect($elm.classList.contains('button--success')).to.be.false;
    expect($clipboardText).to.be.empty;
    $elm.click();
    expect($elm.textContent).to.equal('Copied!');
    expect($elm.classList.contains('button--success')).to.be.true;
    expect($clipboardText).to.equal('Text to store in clipboard');
  });

});
