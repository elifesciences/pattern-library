let expect = chai.expect;

// load in component(s) to be tested
let FragmentHandler = require('../assets/js/components/FragmentHandler');

describe('A FragmentHandler Component', function () {
  'use strict';
  let $elm;
  let fragmentHandler;
  let windowMock;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="FragmentHandler"]');
    fragmentHandler = new FragmentHandler($elm);
    windowMock = {
      addEventListener: function() {}
    };

  });

  afterEach(function () {
    $elm = null;
    fragmentHandler = null;
  });

  it('exists', function () {
    expect(fragmentHandler).to.exist;
  });

  describe('gets the id of a collapsed section containing a fragment with the id of the hash',
  function () {

    it('possesses the method isIdOfOrWithinSection', function () {
      expect(fragmentHandler.isIdOfOrWithinSection).to.be.a('function');
    });

    describe('the isIdOfOrWithinSection method', function () {

      let docMock;

      beforeEach(function () {
        docMock = { querySelector: function () {} };
      });

      it('returns true if the id tested matches the section id', function () {
        expect(fragmentHandler.isIdOfOrWithinSection('matched', { id: 'matched' })).to.be.true;
      });

      it('returns true if the id tested is a descendant of the section', function () {
        let areElementsNestedMock = function () { return true; };
        expect(fragmentHandler.isIdOfOrWithinSection('descendant',
                                                     { id: 'ancestor' },
                                                     docMock,
                                                     areElementsNestedMock)).to.be.true;
      });

      it ('returns false if the id tested is not of or within the section', function () {
        let areElementsNestedMock = function () { return false; };
        expect(fragmentHandler.isIdOfOrWithinSection('noMatch',
                                                     { id: 'someOtherId' },
                                                     docMock,
                                                     areElementsNestedMock)).to.be.false;
      });
    });

    it('possesses the method getIdOfCollapsedSection', function () {
      expect(fragmentHandler.getIdOfCollapsedSection).to.be.a('function');
    });

    describe('the getIdOfCollapsedSection method', function () {

      it('returns null if there are no collapsed article sections in the document', function () {

        let docMock = {
          querySelector: function (selector) {
            if (selector === '.article-section--collapsed') {
              return null;
            }

            if (selector.indexOf('#') > -1) {
              return true;
            }
          }
        };

        let areElementsNestedMock = function () {
          return true;
        };

        expect(fragmentHandler.getIdOfCollapsedSection('arbitraryElementId',
                                                       docMock,
                                                       areElementsNestedMock)).to.be.null;
      });

      it('returns null if hash does not identify a fragment of or within any collapsed sections',
      function () {

        let areElementsNestedMock = function () { return false; };
        let collapsedSectionIds = [ 'collapsedA', 'collapsedB', 'collapsedC' ];
        let hash = 'outsideAnyCollapsedSection';
        let docMock = {
          querySelector: function (selector) {
            if (selector === '.article-section--collapsed') {
              return collapsedSectionIds
            }
          }
        };

        expect(fragmentHandler.getIdOfCollapsedSection(hash,
                                                       docMock,
                                                       areElementsNestedMock)).to.be.null;

      });
      
      it('returns the id of the section if it matches the hash', function () {

        let matchingId = 'iAmACollapsedSection';
        let docMock = {
          querySelector: function (selector) {
            if (selector === '.article-section--collapsed')  {
              return [ { id: matchingId } ];
            }
          }
        };

        let areElementsNestedMock = function () { return false; };
        let valueUnderTest = fragmentHandler.getIdOfCollapsedSection(matchingId, docMock, areElementsNestedMock);
        expect(valueUnderTest).to.equal(matchingId);
      });

      it('returns the id of the collapsed section if the hash matches a descendant element',
      function () {
        let sectionId = 'iAmACollapsedSection';
        let descendantId = 'iAmADescendantOfACollapsedSection';
        let docMock = {
          querySelector: function (selector) {
            if (selector === '.article-section--collapsed')  {
              return [ { id: sectionId } ];
            }
          }
        };

        let areElementsNestedMock = function () { return true; };
        let valueUnderTest = fragmentHandler.getIdOfCollapsedSection(descendantId, docMock, areElementsNestedMock);
        expect(valueUnderTest).to.equal(sectionId);

      });

    });

  });

});
