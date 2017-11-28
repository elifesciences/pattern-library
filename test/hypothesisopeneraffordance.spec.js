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

    context('when the window is at least 900px wide', () => {

      let windowMock;

      before(() => {
        windowMock = {};
        windowMock.appendChild = () => {};
        windowMock.matchMedia = function (mediaStatement) {
          if (mediaStatement === '(min-width: 900px)') {
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

    context('when the window is narrower than 900px', () => {

      let windowMock;

      before(() => {
        windowMock = {};
        windowMock.matchMedia = function (mediaStatement) {
          if (mediaStatement === '(min-width: 900px)') {
            return {
              matches: false
            };
          }

          return {
            matches: true
          };
        }
      });

      it('returns "singleColumn"', () => {
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

      it('returns the ".article-section__body" child of the next element sibling to the abstract', () => {
        const foundAnchorPoint = HypothesisOpenerAffordance.findAnchorPoint($containsAbstract);
        expect(foundAnchorPoint.parentNode.getAttribute('id')).to.equal('nextFollowingElementSiblingAfterAbstract');
        expect(foundAnchorPoint.classList.contains('article-section__body')).to.be.true;
      });

    });

    context('when an abstract is not present in the document', () => {

      let $doesNotContainAbstract;

      before(() => {
        $doesNotContainAbstract = require('./fixtures/snippetWithoutAbstract.html')();
      });

      it('returns the last ".article-section" element\'s last p element child', () => {
        const foundAnchorPoint = HypothesisOpenerAffordance.findAnchorPoint($doesNotContainAbstract);
        expect(foundAnchorPoint).to.equal($doesNotContainAbstract.querySelector('.article-section:last-child p:last-child'));
      });

    });

  });

});
