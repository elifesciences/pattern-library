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

  it('handles being clicked by fetching and showing reference', function (done) {
    let e = {
      pageX: 0,
      pageY: 0,
      preventDefault() {
      },
    };

    popup.handleLinkClick(e);
    expect(popup.isOpen).to.be.true
    popup.render(e).then(($el) => {
      expect(document.querySelector('.popup__hit-box')).to.exist;
      expect(document.querySelector('.popup__window')).to.exist;
      expect(document.querySelector('.popup__content').textContent).to.equal('I\'m body contents');
    }).then(done).catch(done)
  });

  it('handles being clicked a second time and closing', function (done) {
    let e = {
      pageX: 0,
      pageY: 0,
      preventDefault() {
      },
    };

    popup.handleLinkClick(e);
    popup.render(e).then(($el) => {
      expect(document.querySelector('.popup__hit-box').style.display).to.equal('none');
    }).then(done).catch(done);
  });
});
