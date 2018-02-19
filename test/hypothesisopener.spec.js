const expect = chai.expect;
const spy = sinon.spy;

const HypothesisOpener = require('../assets/js/components/HypothesisOpener');

describe('A HypothesisOpener Component', function () {
  'use strict';

  let $opener;
  let hypothesisOpener;

  beforeEach(() => {
    // $opener = document.querySelector('[data-behaviour="HypothesisOpener"]');
    $opener = require('./fixtures/hypothesisOpenerInitialDom.html')();
    hypothesisOpener = new HypothesisOpener($opener);
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

  describe('the findPositioningMethod() method', () => {

    context('when supplied with an article type that should not have default positioning', () => {

      it('returns the expected positioning method for an "Inside eLife" article', () => {
        expect(HypothesisOpener.findPositioningMethod('Inside eLife')).to.equal(HypothesisOpener.positionCentrally);
      });

      it('returns the expected positioning method for an "Interview"', () => {
        expect(HypothesisOpener.findPositioningMethod('Interview')).to.equal(HypothesisOpener.positionCentrally);
      });

      it('returns the expected positioning method for a "Press Pack"', () => {
        expect(HypothesisOpener.findPositioningMethod('Press Pack')).to.equal(HypothesisOpener.positionCentrally);
      });

      it('returns the expected positioning method for a "Labs Post"', () => {
        expect(HypothesisOpener.findPositioningMethod('Labs Post')).to.equal(HypothesisOpener.positionCentrally);
      });

      it('returns the expected positioning method for an "Insight"', () => {
        expect(HypothesisOpener.findPositioningMethod('Insight')).to.equal(HypothesisOpener.positionPastAbstract);
      });

      it('returns the expected positioning method for a "Feature Article"', () => {
        expect(HypothesisOpener.findPositioningMethod('Feature Article')).to.equal(HypothesisOpener.positionPastAbstract);
      });

      it('returns the expected positioning method for an "Editorial"', () => {
        expect(HypothesisOpener.findPositioningMethod('Editorial')).to.equal(HypothesisOpener.positionPastAbstract);
      });

    });

    context('when not supplied with an article type that should not have default positioning', () => {

      it('returns the default positioning method', () => {
        expect(HypothesisOpener.findPositioningMethod('Research Article')).to.equal(HypothesisOpener.positionByAbstract);
        expect(HypothesisOpener.findPositioningMethod('Research Advance')).to.equal(HypothesisOpener.positionByAbstract);
        expect(HypothesisOpener.findPositioningMethod('Short Report')).to.equal(HypothesisOpener.positionByAbstract);
        expect(HypothesisOpener.findPositioningMethod('Registered Report')).to.equal(HypothesisOpener.positionByAbstract);
        expect(HypothesisOpener.findPositioningMethod('Registered Report')).to.equal(HypothesisOpener.positionByAbstract);
        expect(HypothesisOpener.findPositioningMethod('Replication Study')).to.equal(HypothesisOpener.positionByAbstract);
        expect(HypothesisOpener.findPositioningMethod('Tools and Resources')).to.equal(HypothesisOpener.positionByAbstract);
        expect(HypothesisOpener.findPositioningMethod('Correction')).to.equal(HypothesisOpener.positionByAbstract);
        expect(HypothesisOpener.findPositioningMethod('Retraction')).to.equal(HypothesisOpener.positionByAbstract);
        expect(HypothesisOpener.findPositioningMethod('Scientific Correspondence')).to.equal(HypothesisOpener.positionByAbstract);
        expect(HypothesisOpener.findPositioningMethod('Research Exchange')).to.equal(HypothesisOpener.positionByAbstract);
      });

    });

  });

  describe('the positionByAbstract method', () => {

    context('when an abstract is not present in the document', () => {

      let $doesNotContainAbstract;

      before(() => {
        $doesNotContainAbstract = require('./fixtures/snippetWithoutAbstract.html')();
      });

      it('throws an error', () => {
        expect(() => {
          HypothesisOpener.positionByAbstract($opener, $doesNotContainAbstract);
        }).to.throw('Trying to position hypothesis opener by abstract but no abstract found.');

      });

    });

    context('when an abstract is present in the document', () => {

      let $containsAbstract;
      let id;
      let opener;

      beforeEach(() => {
        $containsAbstract = require('./fixtures/snippetWithAbstract.html')();
        opener = new HypothesisOpener($opener);

        id = 'IShouldBeAppendedToTheAbstract';
        opener.$elm.setAttribute('id', id);

        expect($containsAbstract.querySelector(`#${id}`)).to.be.null;

      });

      it('appends the opener to the abstract', () => {

        HypothesisOpener.positionByAbstract(opener.$elm, $containsAbstract);

        const $lastElementInAbstract = $containsAbstract.querySelector('#abstract').lastElementChild;
        expect($lastElementInAbstract.getAttribute('id')).to.equal(id);
        expect($lastElementInAbstract).to.deep.equal(opener.$elm);
      });

    });

  });

  describe('the positionPastAbstract method', () => {

    context('when an abstract is not present in the document', () => {

      let $doesNotContainAbstract;

      before(() => {
        $doesNotContainAbstract = require('./fixtures/snippetWithoutAbstract.html')();
      });

      it('throws an error', () => {
        expect(() => {
          HypothesisOpener.positionPastAbstract($opener, $doesNotContainAbstract);
        }).to.throw('Trying to position hypothesis opener in section following abstract, but no abstract found.');

      });

    });

    context('when an abstract is present in the document', () => {

      let $containsAbstract;
      let id;
      let opener;

      beforeEach(() => {
        $containsAbstract = require('./fixtures/snippetWithAbstract.html')();
        opener = new HypothesisOpener($opener);

        id = 'IShouldBeAppendedToTheSectionFollowingTheAbstract';
        opener.$elm.setAttribute('id', id);

        expect($containsAbstract.querySelector(`#${id}`)).to.be.null;

      });

      it('appends the opener to the section following the abstract', () => {
        HypothesisOpener.positionPastAbstract(opener.$elm, $containsAbstract);
        const $expectedParent = $containsAbstract.querySelector('#abstract').nextElementSibling.querySelector('.article-section__body');
        expect($expectedParent.lastElementChild).to.deep.equal(opener.$elm);
      });

    });

  });

  describe('the positionCentrally method', () => {

    context('when there are no paragraphs in the article', () => {

      let $zeroParagraphCount;
      let opener;
      let id;

      beforeEach(() => {
        $zeroParagraphCount = require('./fixtures/snippetWithZeroParagraphs.html')();
        opener = new HypothesisOpener($opener);

        id = 'IShouldBeAppendedToTheEndOfTheArticle';
        opener.$elm.setAttribute('id', id);

        expect($zeroParagraphCount.querySelector(`#${id}`)).to.be.null;

      });

      it('positions the opener at the end of the article', () => {
        HypothesisOpener.positionCentrally(opener.$elm, $zeroParagraphCount);
        expect($zeroParagraphCount.lastElementChild).to.deep.equal(opener.$elm);
      });

    });

    context('when there are an odd number of paragraphs in the article', () => {

      let $oddParagraphCount;
      let opener;
      let id;

      beforeEach(() => {
        $oddParagraphCount = require('./fixtures/snippetWithFiveParagraphs.html')();
        opener = new HypothesisOpener($opener);

        id = 'IShouldBeAppendedToTheMiddleParagraph';
        opener.$elm.setAttribute('id', id);

        expect($oddParagraphCount.querySelector(`#${id}`)).to.be.null;

      });

      it('positions the opener by the middle paragraph', () => {
        HypothesisOpener.positionCentrally(opener.$elm, $oddParagraphCount);
        const paragraphs = $oddParagraphCount.querySelectorAll('p');
        const $expectedParent = paragraphs[Math.floor(paragraphs.length / 2)];
        expect($expectedParent.lastElementChild).to.deep.equal(opener.$elm);
      });

    });

    context('when there are an even number of paragraphs (n) in the article', () => {

      let $evenParagraphCount;
      let opener;
      let id;

      beforeEach(() => {
        $evenParagraphCount = require('./fixtures/snippetWithSixParagraphs.html')();
        opener = new HypothesisOpener($opener);

        id = 'IShouldBeAppendedToTheMiddleParagraphRoundingDown';
        opener.$elm.setAttribute('id', id);

        expect($evenParagraphCount.querySelector(`#${id}`)).to.be.null;

      });

      it('positions the opener by the n/2 paragraph', () => {
        HypothesisOpener.positionCentrally(opener.$elm, $evenParagraphCount);
        const paragraphs = $evenParagraphCount.querySelectorAll('p');
        const $expectedParent = paragraphs[paragraphs.length / 2];
        expect($expectedParent.lastElementChild).to.deep.equal(opener.$elm);
      });

    });

  });

});
