"use strict";

let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let elifeUtils = require('../assets/js/libs/elife-utils')();

describe('The eLife utils library', function () {

  it('exists', function () {
    expect(elifeUtils).to.exist;
  });

  describe('its adjustPxString method', function () {

    it('can add a numerical value to a px string, returning adjusted value as a px string',
    function () {
      expect(elifeUtils.adjustPxString('200px', 3)).to.equal('203px');
      expect(elifeUtils.adjustPxString('-1px', 500)).to.equal('499px');
      expect(elifeUtils.adjustPxString('-1000px', 200)).to.equal('-800px');
    });

    it('can subtract a numerical value from a px string, returning adjusted value as a px string',
    function () {
       expect(elifeUtils.adjustPxString('203px', -3)).to.equal('200px');
       expect(elifeUtils.adjustPxString('1px', -500)).to.equal('-499px');
       expect(elifeUtils.adjustPxString('-1000px', -200)).to.equal('-1200px');
     });

    it('can add a numerical value to a "0" string, returning adjusted value as a px string',
     function () {
       expect(elifeUtils.adjustPxString('0', 25)).to.equal('25px');
     });

    it('can subtract a numerical numerical value from a "0" string, returning adjusted value as a px string',
     function () {
       expect(elifeUtils.adjustPxString('0', -25)).to.equal('-25px');
     });


    it('can add a numerical value to a px string, returning a "0" string correctly',
     function () {
       expect(elifeUtils.adjustPxString('-100px', 100)).to.equal('0');
     });

    it('can subtract a numerical value from a px string, returning a "0" string correctly',
       function () {
         expect(elifeUtils.adjustPxString('100px', -100)).to.equal('0');
       });

  });

  describe('its invertPxString method', function () {

    it('can mathematically invert a positive px value', function () {
      expect(elifeUtils.invertPxString('100px')).to.equal('-100px');
    });

    it('can mathematically invert a negative px value', function () {
      expect(elifeUtils.invertPxString('-100px')).to.equal('100px');
    });

    it('doesn\'t change a "0" string', function () {
      expect(elifeUtils.invertPxString('0')).to.equal('0');
    });

  });

  describe('its isHighDpr method', function () {

    it('returns true if device pixel ratio is at least 2', function () {
      expect(elifeUtils.isHighDpr({ devicePixelRatio: 2 })).to.be.true;
      expect(elifeUtils.isHighDpr({ devicePixelRatio: 2.1 })).to.be.true;
      expect(elifeUtils.isHighDpr({ devicePixelRatio: 3 })).to.be.true;
    });

    it('returns false if device pixel ratio is less than 2', function () {
      expect(elifeUtils.isHighDpr({ devicePixelRatio: 1 })).to.be.false;
      expect(elifeUtils.isHighDpr({ devicePixelRatio: 1.4 })).to.be.false;
      expect(elifeUtils.isHighDpr({ devicePixelRatio: 1.9 })).to.be.false;
    });

  });

});
