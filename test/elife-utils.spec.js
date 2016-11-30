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

});
