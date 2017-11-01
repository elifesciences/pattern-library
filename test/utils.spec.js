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

  describe('the isIdOfOrWithinSection function', () => {

    let $target;

    before(() => {
      $target = document.querySelector('.isIdOfOrWithinSection').querySelector('.target');
    });

    it('returns true if the supplied id matches that of target element', () => {
      const idOfTargetElement = 'isIdOfOrWithinSection_targetHit';
      expect(utils.isIdOfOrWithinSection(idOfTargetElement, $target, document)).to.be.true;
    });

    it('returns true if an element with the supplied id is a descendant of the target element', () => {
      const idOfChildOfTargetElement = 'isIdOfOrWithinSection_targetHit_child';
      expect(utils.isIdOfOrWithinSection(idOfChildOfTargetElement, $target, document)).to.be.true;

      const idOfGrandChildOfTargetElement = 'isIdOfOrWithinSection_targetHit_grandChild';
      expect(utils.isIdOfOrWithinSection(idOfGrandChildOfTargetElement, $target, document)).to.be.true;
    });

    it('returns false if an element with the supplied id is not a descendant of the target element', () => {
      const idOfExistingElementNotInTreeOfTargetElement = 'isIdOfOrWithinSection_targetMiss';
      expect(utils.isIdOfOrWithinSection(idOfExistingElementNotInTreeOfTargetElement, $target, document)).to.be.false;

      const httpPrefixed = 'http://example.com';
      expect(utils.isIdOfOrWithinSection(httpPrefixed, $target, document)).to.be.false;

      const httpsPrefixed = 'https://example.com';
      expect(utils.isIdOfOrWithinSection(httpsPrefixed, $target, document)).to.be.false;

      const notOnThePage = 'madeUpId';
      expect(utils.isIdOfOrWithinSection(notOnThePage, $target, document)).to.be.false;
    });

  });

  describe('the areElementsNested function', () => {

    let $scope;
    let $referenceElement;

    before(() => {
      $scope = document.querySelector('.areElementsNested');
      $referenceElement = $scope.querySelector('.target');
    });

    it('returns true if the candidate is the reference element', () => {
      expect(utils.areElementsNested($referenceElement, $referenceElement)).to.be.true;
    });

    it('returns true if the candidate is a descendant of the reference element', () => {
      const $childDescendant = $scope.querySelector('.target-child');
      expect(utils.areElementsNested($referenceElement, $childDescendant)).to.be.true;

      const $grandChildDescendant = $scope.querySelector('.target-grand-child');
      expect(utils.areElementsNested($referenceElement, $grandChildDescendant)).to.be.true;
    });

    it('returns false if the candidate is neither the reference element or its descendant', () => {
      const unrelated = [
        $scope.querySelector('.target-miss'),
        1,
        0,
        'a string',
        ['an array'],
        {an: 'object'},
        null,
        undefined,
        true,
        false,
      ];
      unrelated.forEach((item) => {
        expect(utils.areElementsNested($referenceElement, item)).to.be.false;
      });
    });

  });

});
