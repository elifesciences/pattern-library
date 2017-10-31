let expect = chai.expect;

// load in component(s) to be tested
let utils = require('../assets/js/libs/elife-utils')();

describe('The utils library', function () {
  "use strict";


  describe('the adjustPxString function', function () {


    it('returns the correct value of an addition operation', () => {
      const data = [
        {
          operation: 'add',
          baseValue: '20px',
          operand: 10,
          expectedResult: '30px'
        },
        {
          operation: 'add',
          baseValue: '-100px',
          operand: 10,
          expectedResult: '-90px'
        }
      ];

      data.forEach((datum) => {
        expect(utils.adjustPxString(datum.baseValue, datum.operand, datum.operation)).to.equal(datum.expectedResult);
      });

    });

    it('returns the correct value of a subtraction operation', () => {
      const data = [
        {
          operation: 'subtract',
          baseValue: '20px',
          operand: 10,
          expectedResult: '10px'
        },
        {
          operation: 'subtract',
          baseValue: '100px',
          operand: 2017,
          expectedResult: '-1917px'
        }
      ];

      data.forEach((datum) => {
        expect(utils.adjustPxString(datum.baseValue, datum.operand, datum.operation)).to.equal(datum.expectedResult);
      });

    });

    it('returns the correct value of a multiplication operation', () => {
      const data = [
        {
          operation: 'multiply',
          baseValue: '20px',
          operand: 10,
          expectedResult: '200px'
        },
        {
          operation: 'multiply',
          baseValue: '-5px',
          operand: 6,
          expectedResult: '-30px'
        },

      ];

      data.forEach((datum) => {
        expect(utils.adjustPxString(datum.baseValue, datum.operand, datum.operation)).to.equal(datum.expectedResult);
      });

    });

    it('returns the correct value of a division operation', () => {
      const data = [
        {
          operation: 'divide',
          baseValue: '200px',
          operand: 10,
          expectedResult: '20px'
        },
        {
          operation: 'divide',
          baseValue: '-12px',
          operand: 6,
          expectedResult: '-2px'
        },
      ];

      data.forEach((datum) => {
        expect(utils.adjustPxString(datum.baseValue, datum.operand, datum.operation)).to.equal(datum.expectedResult);
      });

    });

  });

});
