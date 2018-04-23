const chai = require('chai');
const sinon = require('sinon');

const HypothesisOpener = require('../assets/js/components/HypothesisOpener');

const generateSnippetWithoutIdentifiableFirstSection = require('./fixtures/snippetWithoutIdentifiableFirstSection.html');
const generateSnippetWithIdentifiableFirstSection = require('./fixtures/snippetWithIdentifiableFirstSection.html');
const generateSnippetWithParagraphs = require('./fixtures/snippetWithParagraphs.html');
const generateHypothesisOpenerInitialDom = require('./fixtures/hypothesisOpenerInitialDom.html');
const generateParentOf$scriptIdentifiedAsHypothesisLoader = require('./fixtures/scriptElementIdentifiedAsHypothesisLoader.html');

const expect = chai.expect;
const spy = sinon.spy;

describe('A HypothesisOpener Component', function () {
  'use strict';

  let $opener;

  beforeEach(() => {
    $opener = generateHypothesisOpenerInitialDom();
  });

  afterEach(() => {
    $opener = null;
  });

  describe('the get$hypothesisLoader method', () => {

    context('when the hypothesis loading code is missing', () => {

      it('throws an error with the message "No Hypothesis loading code found"', () => {
        const $mockAncestorWithNoLoadingCode = document.createElement('script');
        expect(() => {
          HypothesisOpener.get$hypothesisLoader($mockAncestorWithNoLoadingCode);
        }).to.throw('No Hypothesis loading code found');
      });

    });

    context('when the hypothesis loading code is not missing', () => {

      it('does not throw an error', () => {
        const $mockLoaderAncestor = generateParentOf$scriptIdentifiedAsHypothesisLoader();
        expect(() => {
          HypothesisOpener.get$hypothesisLoader($mockLoaderAncestor);
        }).not.to.throw();
      });

    });

  });

  describe('the setupPreReadyIndicatorsWithTimer method', () => {

    let hypothesisOpener;
    let mockDoc;
    let $mockLoader;

    beforeEach(() => {
      mockDoc = {
        querySelectorAll: () => {}
      };
      const $mockAncestorLoader = generateParentOf$scriptIdentifiedAsHypothesisLoader();
      mockDoc.querySelector = (...args) => {
        if (args[0] === 'body') {
          return $mockAncestorLoader;
        }

        if (args[0] === '#hypothesisEmbedder') {
          return $mockAncestorLoader.querySelector('#hypothesisEmbedder');
        }

      };

      $mockLoader = mockDoc.querySelector('#hypothesisEmbedder');
      hypothesisOpener = new HypothesisOpener($opener, window, mockDoc);
    });

    afterEach(() => {
      hypothesisOpener = null;
    });

    context('when the load has already failed', () => {

      let hypothesisOpener;

      beforeEach(() => {
        hypothesisOpener = new HypothesisOpener($opener, window, document);
      });

      it('calls handleInitFail', () => {

        const failHandlerSpy = spy(hypothesisOpener, 'handleInitFail');
        $mockLoader.dataset.hypothesisEmbedLoadStatus = 'failed';
        hypothesisOpener.setupPreReadyIndicatorsWithTimer($mockLoader);
        expect(failHandlerSpy.callCount).to.equal(1);
        hypothesisOpener.handleInitFail.restore();
      });

    });

    it('adds a "loaderror" event listener to the hypothesis loader script element', () => {
      const listenerSpy = spy($mockLoader, 'addEventListener');

      hypothesisOpener.setupPreReadyIndicatorsWithTimer($mockLoader);
      expect(listenerSpy.calledOnce).to.be.true;
      expect(listenerSpy.getCall(0).args[0]).to.equal('loaderror');

      $mockLoader.addEventListener.restore();
    });

    describe('the timer', () => {

      it('expires after 10000 ms', () => {
        const timeoutSpy = spy(window, 'setTimeout');
        expect(timeoutSpy.callCount).to.equal(0);

        hypothesisOpener.setupPreReadyIndicatorsWithTimer($mockLoader);
        expect(timeoutSpy.callCount).to.equal(1);
        expect(timeoutSpy.getCall(0).args[1]).to.equal(10000);

        window.setTimeout.restore();
      });

      it('has a callback which calls handleInitFail', () => {
        const handleInitFailSpy = spy(hypothesisOpener, 'handleInitFail');
        hypothesisOpener.handleTimerExpired();
        expect(handleInitFailSpy.calledOnce).to.be.true;
        hypothesisOpener.handleInitFail.restore();
      });

    });

  });

  describe('the handleInitFail method', () => {

    let hypothesisOpener;

    beforeEach(() => {
      hypothesisOpener = new HypothesisOpener($opener, window, document);
    });

    it('logs the console error "Problem loading or interacting with Hypothesis client."', () => {
      const errorSpy = spy(window.console, 'error');
      hypothesisOpener.handleInitFail(null, window);
      const observedFirstCallArg = errorSpy.getCalls()[0].args[0];
      expect(observedFirstCallArg.message).to.equal('Problem loading or interacting with Hypothesis client.');
      window.console.error.restore();
    });

    it('clears the timer', () => {
      const mockTimerRef = 12345;
      const clearTimeoutSpy = spy(window, 'clearTimeout');
      hypothesisOpener.handleInitFail(mockTimerRef, window);
      expect(clearTimeoutSpy.calledOnceWithExactly(mockTimerRef)).to.be.true;
      window.clearTimeout.restore();
    });

    it('triggers UI failure state', () => {
      const showFailureSpy = spy(hypothesisOpener.speechBubble, 'showFailureState');
      hypothesisOpener.handleInitFail(null, window);
      expect(showFailureSpy.calledOnce).to.be.true;
      hypothesisOpener.speechBubble.showFailureState.restore();
    });

    it('triggers removal of Hypothesis UI', () => {
      const removeUISpy = spy(hypothesisOpener, 'removeHypothesisUI');
      hypothesisOpener.handleInitFail(null, window);
      expect(removeUISpy.calledOnce).to.be.true;
      hypothesisOpener.removeHypothesisUI.restore();
    });

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
