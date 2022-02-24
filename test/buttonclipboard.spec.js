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
    const btnClipboard = new ButtonClipboard($elm);

    // Reset clipboard
    btnClipboard.copyToClipboard('reset', () => true);
  });

  it('store value in clipboard', () => {
    expect($elm.textContent).to.equal('Button clipboard');
    expect($elm.classList.contains('button--success')).to.be.false;
    $elm.click();
    expect($elm.textContent).to.equal('Copied!');
    expect($elm.classList.contains('button--success')).to.be.true;

    expect(() => {
      const textArea = document.createElement('textarea');
      textArea.value = '';

      // Avoid scrolling to bottom
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.position = 'fixed';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('paste');

      const pasteValue = textArea.value;

      document.body.removeChild(textArea);

      return pasteValue;
    }).to.equal('Text to store in clipboard');
  });

});
