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

  describe('the invertPxString function', () => {

    it('makes a positive px string negative, without changing the absolute quantity', () => {
      expect(utils.invertPxString('-99px')).to.equal('99px');
    });

    it('makes a negative px string positive, without changing the absolute quantity', () => {
      expect(utils.invertPxString('99px')).to.equal('-99px');
    });

    it('returns the number 0 as a string if supplied with a zero px string', () => {
      expect(utils.invertPxString('0px')).to.equal('0');
    });

  });

  describe('the flatten function', () => {

    it('flattens the upper most nested level of a nested array', () => {
      expect(utils.flatten( [ 1, 2, [ 3, 4 ] ] )).to.have.members( [ 1, 2, 3, 4 ] );
      expect(utils.flatten( [ 1, 2, [ 3, 4, [ 5 ] ] ] )).to.have.deep.members( [ 1, 2, 3, 4, [ 5 ] ] );
    });

  });

});
