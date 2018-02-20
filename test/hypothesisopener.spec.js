const expect = chai.expect;
const spy = sinon.spy;

const HypothesisOpener = require('../assets/js/components/HypothesisOpener');

const generateSnippetWithoutIdentifiableFirstSection = require('./fixtures/snippetWithoutIdentifiableFirstSection.html');
const generateSnippetWithIdentifiableFirstSection = require('./fixtures/snippetWithIdentifiableFirstSection.html');
const generateSnippetWithParagraphs = require('./fixtures/snippetWithParagraphs.html');
const generateHypothesisOpenerInitialDom = require('./fixtures/hypothesisOpenerInitialDom.html');

describe('A HypothesisOpener Component', function () {
  'use strict';

  let $opener;
  let hypothesisOpener;

  beforeEach(() => {
    $opener = generateHypothesisOpenerInitialDom();
    hypothesisOpener = new HypothesisOpener($opener);
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
      let opener;

      beforeEach(() => {
        $containsFirstSection = generateSnippetWithIdentifiableFirstSection();
        opener = new HypothesisOpener($opener);

        id = 'IShouldBeAppendedToTheFirstSection';
        opener.$elm.setAttribute('id', id);

        expect($containsFirstSection.querySelector(`#${id}`)).to.be.null;

      });

      it('appends the opener to the first section', () => {

        HypothesisOpener.positionByFirstSection(opener.$elm, $containsFirstSection);

        const $finalElementInFirstSection = $containsFirstSection.querySelector('.article-section--first').lastElementChild;
        expect($finalElementInFirstSection.getAttribute('id')).to.equal(id);
        expect($finalElementInFirstSection).to.deep.equal(opener.$elm);
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
      let opener;

      beforeEach(() => {
        $hasIdentifiableFistSection = generateSnippetWithIdentifiableFirstSection();
        opener = new HypothesisOpener($opener);

        id = 'IShouldBeAppendedToTheSecondSection';
        opener.$elm.setAttribute('id', id);

        expect($hasIdentifiableFistSection.querySelector(`#${id}`)).to.be.null;

      });

      it('appends the opener to the second section', () => {
        HypothesisOpener.positionBySecondSection(opener.$elm, $hasIdentifiableFistSection);
        const $expectedParent = $hasIdentifiableFistSection.querySelector('.article-section--first').nextElementSibling.querySelector('.article-section__body');
        expect($expectedParent.lastElementChild).to.deep.equal(opener.$elm);
      });

    });

  });

  describe('the positionCentrallyInline method', () => {

    context('when there are no paragraphs in the article', () => {

      let $zeroParagraphCount;
      let opener;
      let id;

      beforeEach(() => {
        $zeroParagraphCount = generateSnippetWithParagraphs(0);
        opener = new HypothesisOpener($opener);

        id = 'IShouldBeAppendedToTheEndOfTheArticle';
        opener.$elm.setAttribute('id', id);

        expect($zeroParagraphCount.querySelector(`#${id}`)).to.be.null;

      });

      it('positions the opener at the end of the article', () => {
        HypothesisOpener.positionCentrallyInline(opener.$elm, $zeroParagraphCount);
        expect($zeroParagraphCount.lastElementChild).to.deep.equal(opener.$elm);
      });

    });

    context('when there are an odd number of paragraphs in the article', () => {

      let $oddParagraphCount;
      let opener;
      let id;

      beforeEach(() => {
        $oddParagraphCount = generateSnippetWithParagraphs(5);
        opener = new HypothesisOpener($opener);

        id = 'IShouldBeAppendedToTheMiddleParagraph';
        opener.$elm.setAttribute('id', id);

        expect($oddParagraphCount.querySelector(`#${id}`)).to.be.null;

      });

      it('positions the opener by the middle paragraph', () => {
        HypothesisOpener.positionCentrallyInline(opener.$elm, $oddParagraphCount);
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
        $evenParagraphCount = generateSnippetWithParagraphs(6);
        opener = new HypothesisOpener($opener);

        id = 'IShouldBeAppendedToTheMiddleParagraphRoundingDown';
        opener.$elm.setAttribute('id', id);

        expect($evenParagraphCount.querySelector(`#${id}`)).to.be.null;

      });

      it('positions the opener by the n/2 paragraph', () => {
        HypothesisOpener.positionCentrallyInline(opener.$elm, $evenParagraphCount);
        const paragraphs = $evenParagraphCount.querySelectorAll('p');
        const $expectedParent = paragraphs[paragraphs.length / 2];
        expect($expectedParent.lastElementChild).to.deep.equal(opener.$elm);
      });

    });

  });

});
