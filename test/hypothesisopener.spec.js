const chai = require('chai');
const expect = chai.expect;

const HypothesisOpener = require('../assets/js/components/HypothesisOpener');

const generateSnippetWithoutIdentifiableFirstSection = require('./fixtures/snippetWithoutIdentifiableFirstSection.html');
const generateSnippetWithIdentifiableFirstSection = require('./fixtures/snippetWithIdentifiableFirstSection.html');
const generateSnippetWithParagraphs = require('./fixtures/snippetWithParagraphs.html');
const generateHypothesisOpenerInitialDom = require('./fixtures/hypothesisOpenerInitialDom.html');

describe('A HypothesisOpener Component', function () {
  'use strict';

  let $opener;

  beforeEach(() => {
    $opener = generateHypothesisOpenerInitialDom();
  });

  describe('the findPositioningMethod() method', () => {

    context('when supplied with an article type that should not have default positioning', () => {

      it('returns the expected positioning method for type "blog-article" (aka Inside eLife)', () => {
        expect(HypothesisOpener.findPositioningMethod('blog-article')).to.equal(HypothesisOpener.positionCentrallyInline);
      });

      it('returns the expected positioning method for type "interview"', () => {
        expect(HypothesisOpener.findPositioningMethod('interview')).to.equal(HypothesisOpener.positionCentrallyInline);
      });

      it('returns the expected positioning method for type "press-package"', () => {
        expect(HypothesisOpener.findPositioningMethod('press-package')).to.equal(HypothesisOpener.positionCentrallyInline);
      });

      it('returns the expected positioning method for a "labs-post"', () => {
        expect(HypothesisOpener.findPositioningMethod('labs-post')).to.equal(HypothesisOpener.positionCentrallyInline);
      });

      it('returns the expected positioning method for an "insight"', () => {
        expect(HypothesisOpener.findPositioningMethod('insight')).to.equal(HypothesisOpener.positionBySecondSection);
      });

      it('returns the expected positioning method for a "feature"', () => {
        expect(HypothesisOpener.findPositioningMethod('feature')).to.equal(HypothesisOpener.positionBySecondSection);
      });

      it('returns the expected positioning method for an "editorial"', () => {
        expect(HypothesisOpener.findPositioningMethod('editorial')).to.equal(HypothesisOpener.positionBySecondSection);
      });

    });

    context('when not supplied with an article type that should not have default positioning', () => {

      it('returns the default positioning method', () => {
        expect(HypothesisOpener.findPositioningMethod('research-article')).to.equal(HypothesisOpener.positionByFirstSection);
        expect(HypothesisOpener.findPositioningMethod('research-advance')).to.equal(HypothesisOpener.positionByFirstSection);
        expect(HypothesisOpener.findPositioningMethod('short-report')).to.equal(HypothesisOpener.positionByFirstSection);
        expect(HypothesisOpener.findPositioningMethod('registered-report')).to.equal(HypothesisOpener.positionByFirstSection);
        expect(HypothesisOpener.findPositioningMethod('replication-study')).to.equal(HypothesisOpener.positionByFirstSection);
        expect(HypothesisOpener.findPositioningMethod('tools-resources')).to.equal(HypothesisOpener.positionByFirstSection);
        expect(HypothesisOpener.findPositioningMethod('correction')).to.equal(HypothesisOpener.positionByFirstSection);
        expect(HypothesisOpener.findPositioningMethod('retraction')).to.equal(HypothesisOpener.positionByFirstSection);
        expect(HypothesisOpener.findPositioningMethod('scientific-correspondence')).to.equal(HypothesisOpener.positionByFirstSection);
      });

    });

  });

  describe('the positionByFirstSection method', () => {

    context('when there is no identifiable first section present in the document', () => {

      let $noIdentifiableFirstSection;

      before(() => {
        $noIdentifiableFirstSection = generateSnippetWithoutIdentifiableFirstSection();
      });

      it('throws an error', () => {
        expect(() => {
          HypothesisOpener.positionByFirstSection($opener, $noIdentifiableFirstSection);
        }).to.throw('Trying to position hypothesis opener by first section but can\'t find element with the css class article-section--first.');

      });

    });

    context('when an identifiable first section is present in the document', () => {

      let $containsFirstSection;
      let id;

      beforeEach(() => {
        $containsFirstSection = generateSnippetWithIdentifiableFirstSection();
        id = 'IShouldBeAppendedToTheFirstSection';
        $opener.setAttribute('id', id);

        expect($containsFirstSection.querySelector(`#${id}`)).to.be.null;

      });

      it('appends the opener to the first section', () => {

        HypothesisOpener.positionByFirstSection($opener, $containsFirstSection);

        const $finalElementInFirstSection = $containsFirstSection.querySelector('.article-section--first').lastElementChild;
        expect($finalElementInFirstSection.getAttribute('id')).to.equal(id);
        expect($finalElementInFirstSection).to.deep.equal($opener);
      });

    });

  });

  describe('the positionBySecondSection method', () => {

    context('when there is no identifiable first section present in the document', () => {

      let $noIdentifiableFirstSection;

      before(() => {
        $noIdentifiableFirstSection = generateSnippetWithoutIdentifiableFirstSection();
      });

      it('throws an error', () => {
        expect(() => {
          HypothesisOpener.positionBySecondSection($opener, $noIdentifiableFirstSection);
        }).to.throw('Trying to position hypothesis opener in second section, but can\'t find element with the css class article-section--first.');
      });

    });

    context('when an identifiable first section is present in the document', () => {

      let $hasIdentifiableFistSection;
      let id;

      beforeEach(() => {
        $hasIdentifiableFistSection = generateSnippetWithIdentifiableFirstSection();
        id = 'IShouldBeAppendedToTheSecondSection';
        $opener.setAttribute('id', id);

        expect($hasIdentifiableFistSection.querySelector(`#${id}`)).to.be.null;

      });

      it('appends the opener to the second section', () => {
        HypothesisOpener.positionBySecondSection($opener, $hasIdentifiableFistSection);
        const $expectedParent = $hasIdentifiableFistSection.querySelector('.article-section--first').nextElementSibling.querySelector('.article-section__body');
        expect($expectedParent.lastElementChild).to.deep.equal($opener);
      });

    });

  });

  describe('the positionCentrallyInline method', () => {

    context('when there are no paragraphs in the article', () => {

      let $zeroParagraphCount;
      let id;

      beforeEach(() => {
        $zeroParagraphCount = generateSnippetWithParagraphs(0);
        id = 'IShouldBeAppendedToTheEndOfTheArticle';
        $opener.setAttribute('id', id);

        expect($zeroParagraphCount.querySelector(`#${id}`)).to.be.null;

      });

      it('positions the opener at the end of the article', () => {
        HypothesisOpener.positionCentrallyInline($opener, $zeroParagraphCount);
        expect($zeroParagraphCount.lastElementChild).to.deep.equal($opener);
      });

    });

    context('when there are an odd number of paragraphs in the article', () => {

      let $snippetWithOddParagraphCount;
      let id;

      beforeEach(() => {
        $snippetWithOddParagraphCount = generateSnippetWithParagraphs(5);
        id = 'IShouldBeAppendedToTheMiddleParagraph';
        $opener.setAttribute('id', id);

        expect($snippetWithOddParagraphCount.querySelector(`#${id}`)).to.be.null;

      });

      it('positions the opener by the middle paragraph', () => {
        HypothesisOpener.positionCentrallyInline($opener, $snippetWithOddParagraphCount);
        const paragraphs = $snippetWithOddParagraphCount.querySelectorAll('p');
        const $expectedParent = paragraphs[Math.floor(paragraphs.length / 2)];
        expect($expectedParent.lastElementChild).to.deep.equal($opener);
      });

    });

    context('when there are an even number of paragraphs (n) in the article', () => {

      let $snippetWithEvenParagraphCount;
      let id;

      beforeEach(() => {
        $snippetWithEvenParagraphCount = generateSnippetWithParagraphs(6);
        id = 'IShouldBeAppendedToTheMiddleParagraphRoundingDown';
        $opener.setAttribute('id', id);

        expect($snippetWithEvenParagraphCount.querySelector(`#${id}`)).to.be.null;

      });

      it('positions the opener by the n/2 paragraph', () => {
        HypothesisOpener.positionCentrallyInline($opener, $snippetWithEvenParagraphCount);
        const paragraphs = $snippetWithEvenParagraphCount.querySelectorAll('p');
        const $expectedParent = paragraphs[Math.floor((paragraphs.length - 1) / 2)];
        expect($expectedParent.lastElementChild).to.deep.equal($opener);
      });

    });

  });

});
