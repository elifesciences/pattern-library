let expect = chai.expect;

require('../assets/js/libs/polyfills');

// load in component(s) to be tested
let ToggleableCaption = require('../assets/js/components/ToggleableCaption');

describe('A ToggleableCaption Component', function () {
  'use strict';
  let $elm = document.querySelector('[data-behaviour="ToggleableCaption"]');
  let toggleableCaption = new ToggleableCaption($elm);

  it('exists', function () {
    expect(toggleableCaption).to.exist;
  });

  it('truncates the caption', function () {
    expect(toggleableCaption.$caption.querySelectorAll('p')).to.have.lengthOf(1);
    expect(toggleableCaption.$caption.querySelector('p:nth-child(1)').innerText).to.not.contains('END1');
    expect(toggleableCaption.$caption.querySelector('.caption-text__toggle--see-more')).to.exist;
    expect(toggleableCaption.$caption.querySelector('.caption-text__toggle--see-less')).to.not.exist;
  });

  it('collapses the caption', function () {
    toggleableCaption.toggleCaption();
    expect(toggleableCaption.$caption.querySelectorAll('p')).to.have.lengthOf(2);
    expect(toggleableCaption.$caption.querySelector('p:nth-child(1)').innerText).to.contains('END1');
    expect(toggleableCaption.$caption.querySelector('p:nth-child(2)').innerText).to.contains('END2');
    expect(toggleableCaption.$caption.querySelector('.caption-text__toggle--see-more')).to.not.exist;
    expect(toggleableCaption.$caption.querySelector('.caption-text__toggle--see-less')).to.exist;
  });

});
