let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let SectionListingLink = require('../assets/js/components/SectionListingLink');

describe('A SectionListingLink Component', function () {
  'use strict';
  let $elm;
  let sectionListingLink;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="SectionListingLink"]');
    sectionListingLink = new SectionListingLink($elm);
  });

  it('exists', function () {
    expect(sectionListingLink).to.exist;
  });

  it('has an href', function () {
    expect(sectionListingLink.href).to.be.a.string;
    expect(sectionListingLink.href).to.not.be.empty;
  });

  it('should know about a listing (which may or may not be a list element)', function () {
    expect(sectionListingLink.$listing instanceof HTMLElement).to.be.true;
  });

  context('if it doesn\'t know about the listing', () => {

    let docMock;
    let sectionListingLink;

    beforeEach(() => {
      docMock = {
        getElementById: () => {
          return null;
        }
      };
      sectionListingLink = new SectionListingLink($elm, window, docMock);
    });

    afterEach(() => {
      $elm.classList.remove('hidden');
    });

    it('should hide the section listing link', () => {
      expect(sectionListingLink.$elm.classList.contains('hidden')).to.be.true;
    });

  });

  it('has a breakpoint of 1200px', () => {
    expect(sectionListingLink.breakpoint).to.equal(1200);
  });

  describe('the id of the listing',() => {
    it('is a non-empty string', () => {
      expect(sectionListingLink.$listing.id).to.be.a.string;
      expect(sectionListingLink.$listing.id).to.not.be.empty;
    });

  });

  describe('the href', () => {

    it('should contain the id of the listing', () => {
      expect(sectionListingLink.href).to.have.string(sectionListingLink.$listing.id);
    });

  });

  describe('handling viewport width changes', () => {

    context('when the viewport is at least as wide as the breakpoint', () => {

      let windowMock;
      let sectionListingLink;

      beforeEach(() => {
        windowMock = {
          addEventListener: () => {
          },
          matchMedia: () => {
            return {
              matches: true
            }
          }
        };
        sectionListingLink = new SectionListingLink($elm, windowMock);
        spy(sectionListingLink, 'showWideView');
        spy(sectionListingLink, 'restoreDefaultView');

      });

      afterEach(() => {
        sectionListingLink.showWideView.restore();
        sectionListingLink.restoreDefaultView.restore();
      });

      it('invokes showing the wide view', () => {
        sectionListingLink.updateView(
          sectionListingLink.$listing,
          sectionListingLink.$defaultListParent,
          sectionListingLink.$wideViewListParent,
          sectionListingLink.breakpoint
        );

        expect(sectionListingLink.showWideView.calledOnce).to.be.true;
        expect(sectionListingLink.showWideView.calledWithExactly(sectionListingLink.$listing, sectionListingLink.$wideViewListParent)).to.be.true;
        expect(sectionListingLink.restoreDefaultView.notCalled).to.be.true;
      });

    });

    context('when the viewport is not as wide as the breakpoint', () => {

      let windowMock;
      let sectionListingLink;

      beforeEach(() => {
        windowMock = {
          addEventListener: () => {
          },
          matchMedia: () => {
            return {
              matches: false
            }
          }
        };
        sectionListingLink = new SectionListingLink($elm, windowMock);
        spy(sectionListingLink, 'showWideView');
        spy(sectionListingLink, 'restoreDefaultView');
      });

      afterEach(() => {
        sectionListingLink.showWideView.restore();
        sectionListingLink.restoreDefaultView.restore();
      });

      it('invokes restoring the default view', () => {
        sectionListingLink.updateView(
          sectionListingLink.$listing,
          sectionListingLink.$defaultListParent,
          sectionListingLink.$wideViewListParent,
          sectionListingLink.breakpoint
        );

        expect(sectionListingLink.restoreDefaultView.calledOnce).to.be.true;
        expect(sectionListingLink.restoreDefaultView.calledWithExactly(sectionListingLink.$listing, sectionListingLink.$defaultListParent)).to.be.true;
        expect(sectionListingLink.showWideView.notCalled).to.be.true;
      });

    });

  });


});
