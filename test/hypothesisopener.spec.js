const expect = chai.expect;
const spy = sinon.spy;

const HypothesisOpener = require('../assets/js/components/HypothesisOpener');

describe('A HypothesisOpener Component', function () {
  'use strict';

  let $opener;

  beforeEach(() => {
    $opener = document.querySelector('[data-behaviour="HypothesisOpener"]');
  });

  describe('the static findInitialAnchorPoint() method', () => {

    context('when an abstract is present in the document', () => {

      let $containsAbstract;

      before(() => {
        $containsAbstract = require('./fixtures/snippetWithAbstract.html')();
      });

      it('returns the ".article-section__body" child of the next element sibling to the abstract', () => {
        const foundAnchorPoint = HypothesisOpener.findInitialAnchorPoint($containsAbstract);
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
        const foundAnchorPoint = HypothesisOpener.findInitialAnchorPoint($doesNotContainAbstract);
        expect(foundAnchorPoint).to.equal($doesNotContainAbstract.querySelector('.article-section:last-child p:last-child'));
      });

    });

  });

});
