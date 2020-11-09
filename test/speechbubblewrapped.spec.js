const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;

// load in component(s) to be tested
const SpeechBubble = require('../assets/js/components/SpeechBubble');

describe('A SpeechBubble Wrapped Component', function () {
  'use strict';
  let $elm;
  let speechBubble;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="SpeechBubble"]');
    speechBubble = new SpeechBubble($elm);
  });

  describe('the removePlaceholder() method', () => {

    it('removes the css class speech-bubble--has-placeholder', () => {
      speechBubble.$elm.classList.add('speech-bubble--has-placeholder');
      expect(speechBubble.$elm.classList.contains('speech-bubble--has-placeholder')).to.be.true;

      speechBubble.removePlaceholder();
      expect(speechBubble.$elm.classList.contains('speech-bubble--has-placeholder')).to.be.false;
    });

    it('removes the default contents', () => {
      speechBubble.$elm.innerHTML = 'something something + side';
      expect(speechBubble.$elm.innerHTML).to.include('+');

      speechBubble.removePlaceholder();
      expect(speechBubble.$elm.innerHTML).not.to.include('+');
    });

  });

  describe('the showPlaceholder() method', () => {

    it('adds the css class speech-bubble--has-placeholder', () => {
      speechBubble.$elm.classList.remove('speech-bubble--has-placeholder');
      expect(speechBubble.$elm.classList.contains('speech-bubble--has-placeholder')).to.be.false;

      speechBubble.showPlaceholder();
      expect(speechBubble.$elm.classList.contains('speech-bubble--has-placeholder')).to.be.true;
    });

    it('injects the speech bubble default contents into the correct location in the speech bubble', () => {
      speechBubble.$elm.innerHTML = 'something something <span class="replace-me">dark</span> side';
      expect(speechBubble.$elm.innerHTML).not.to.include('+');

      speechBubble.showPlaceholder('.replace-me');
      expect(speechBubble.$elm.innerHTML).to.equal('something something <span class="replace-me">+</span> side');
    });

  });

  describe('the update() method', () => {

    it('removes the css class speech-bubble--has-placeholder', () => {
      speechBubble.$elm.classList.add('speech-bubble--has-placeholder');
      expect(speechBubble.$elm.classList.contains('speech-bubble--has-placeholder')).to.be.true;

      speechBubble.update();
      expect(speechBubble.$elm.classList.contains('speech-bubble--has-placeholder')).to.be.false;
    });

    it('substitutes existing contents with supplied content into specified element', () => {
      speechBubble.$elm.innerHTML = 'something something <span class="replace-me">dark</span> side';
      expect(speechBubble.$elm.querySelector('.replace-me').innerHTML).to.equal('dark');

      speechBubble.update('something dark', '.replace-me');
      expect(speechBubble.$elm.querySelector('.replace-me').innerHTML).to.equal('something dark');
    });

  });

});
