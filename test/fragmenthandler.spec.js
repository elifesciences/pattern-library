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

    it('possesses the method getIdOfCollapsedSection', function () {
      expect(fragmentHandler.getIdOfCollapsedSection).to.be.a('function');
    });

    describe('the getIdOfCollapsedSection method', function () {

      it('returns null if there are no collapsed article sections in the document', function () {

        let docMock = {
          querySelectorAll: function (selector) {
            if (selector === '.article-section--collapsed') {
              return [];
            }
          },
          getElementById: function () {}
        };

        expect(fragmentHandler.getIdOfCollapsedSection('arbitraryElementId',
                                                       docMock)).to.be.null;
      });

      it('returns null if hash does not identify a fragment of or within any collapsed sections',
      function () {

        let collapsedSectionIds = [ 'collapsedA', 'collapsedB', 'collapsedC' ];
        let hash = 'outsideAnyCollapsedSection';
        let docMock = {
          querySelectorAll: function (selector) {
            if (selector === '.article-section--collapsed') {
              return collapsedSectionIds
            }
          },
          getElementById: function () {}
        };

        expect(fragmentHandler.getIdOfCollapsedSection(hash,
                                                       docMock)).to.be.null;

      });

      it('returns the id of the section if it matches the hash', function () {

        let matchingId = 'iAmACollapsedSection';
        let docMock = {
          querySelectorAll: function (selector) {
            if (selector === '.article-section--collapsed')  {
              return [ { id: matchingId } ];
            }
          },
          getElementById: function () {}
        };

        let areElementsNestedMock = function () { return false; };
        let valueUnderTest = fragmentHandler.getIdOfCollapsedSection(matchingId, docMock, areElementsNestedMock);
        expect(valueUnderTest).to.equal(matchingId);
      });

      it('returns the id of the collapsed section if the hash matches a descendant element',
      function () {
        let sectionId = 'iAmACollapsedSection';
        let sectionMock = Object.create(Node.prototype);
        sectionMock.id = sectionId;
        let descendantId = 'iAmADescendantOfACollapsedSection';
        let descendantMock = Object.create(Node.prototype);
        descendantMock.id = descendantId;
        sectionMock.compareDocumentPosition = function(other) {
          if (other.id === descendantId) {
            return Node.DOCUMENT_POSITION_CONTAINED_BY;
          }

          return Node.DOCUMENT_POSITION_DISCONNECTED;
        };
        let docMock = {
          querySelectorAll: function (selector) {
            if (selector === '.article-section--collapsed') {
              return [sectionMock]
            }
          },
          getElementById: function (id) {
            if(id === descendantId) {
              return descendantMock;
            }
          }
        };
        let valueUnderTest = fragmentHandler.getIdOfCollapsedSection(descendantId, docMock);
        expect(valueUnderTest).to.equal(sectionId);

      });

    });

  });

});
