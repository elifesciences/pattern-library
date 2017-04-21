let expect = chai.expect;

// load in component(s) to be tested
let Popup = require('../assets/js/components/Popup');

describe('A Popup Component', function () {
  'use strict';

  let $childElm = document.querySelector('[data-behaviour="Popup"]');
  let popup = new Popup($childElm);
  let $elm = popup.$elm;

  it('exists', function () {
    expect(popup).to.exist;
  });

  it('it gets wrapped in span with .popup class', function () {
    expect($elm.classList.contains('popup')).to.be.true;
    expect($elm.firstChild.textContent).to.equal($childElm.textContent);
  });

  it('handles being clicked by fetching and showing reference', function(done) {
    popup.handleLinkClick({  preventDefault() {} });
    expect(popup.isOpen).to.be.true
    popup.render().then(($el) => {
      expect($el.querySelector('.popup__hit-box')).to.exist;
      expect($el.querySelector('.popup__window')).to.exist;
      expect($el.querySelector('.popup__content').textContent).to.equal('I\'m body contents');
    }).then(done).catch(done)
  });

  it('handles being clicked a second time and closing', function(done) {
    popup.handleLinkClick({  preventDefault() {} });
    popup.render().then(($el) => {
      expect($el.classList.contains('popup--hidden')).to.be.true;
    }).then(done).catch(done);
  });
});
