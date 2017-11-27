const expect = chai.expect;
const spy = sinon.spy;

const HypothesisOpenerAffordance = require('../assets/js/components/HypothesisOpenerAffordance');

describe('A HypothesisOpenerAffordance Component', function () {
  'use strict';

  let $opener;
  let affordance;

  beforeEach(() => {
    $opener = document.querySelector('[data-behaviour="HypothesisOpenerAffordance"]');
  });

  describe('the getCurrentDisplayMode() method', () => {

    context('when the window is at least 730px wide', () => {

      let windowMock;

      before(() => {
        windowMock = {};
        windowMock.appendChild = () => {};
        windowMock.matchMedia = function (mediaStatement) {
          console.error('mediaStatement', mediaStatement);
          if (mediaStatement === '(min-width: 730px)') {
            return {
              matches: true
            };
          }

          return {
            matches: false
          };
        }
      });

      it('returns "multiColumn"', () => {
        affordance = new HypothesisOpenerAffordance($opener);
        expect(affordance.getCurrentDisplayMode(windowMock)).to.equal('multiColumn');
      });

    });

    context('when the window is not at least 730px wide', () => {

      let windowMock;

      before(() => {
        windowMock = {};
        windowMock.matchMedia = function (mediaStatement) {
          if (mediaStatement === '(min-width: 730px)') {
            return {
              matches: false
            };
          }

          return {
            matches: true
          };
        }
      });

      it('returns "multiColumn"', () => {
        affordance = new HypothesisOpenerAffordance($opener);
        expect(affordance.getCurrentDisplayMode(windowMock)).to.equal('singleColumn');
      });

    });

  });

  describe('the static findAnchorPoint() method', () => {

    context('when an abstract is present in the document', () => {

      let $containsAbstract;

      before(() => {
        $containsAbstract = require('./fixtures/snippetWithAbstract.html')();
      });

      it('returns the next element sibling to the abstract', () => {
        const foundAnchorPoint = HypothesisOpenerAffordance.findAnchorPoint($containsAbstract);
        expect(foundAnchorPoint.getAttribute('id')).to.equal('nextFollowingElementSiblingAfterAbstract');
      });

    });

    context('when an abstract is not present in the document', () => {

      let $doesNotContainAbstract;

      before(() => {
        $doesNotContainAbstract = require('./fixtures/snippetWithoutAbstract.html')();
      });

      it('returns the main grid__item', () => {
        const foundAnchorPoint = HypothesisOpenerAffordance.findAnchorPoint($doesNotContainAbstract);
        expect(foundAnchorPoint).to.equal($doesNotContainAbstract.querySelector('.wrapper--content > .grid > .grid__item'));
      });

    });

  });

});
