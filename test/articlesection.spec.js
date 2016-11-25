let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let ArticleSection = require('../assets/js/components/ArticleSection');

describe('An Article Section (collapsible)', function () {
  'use strict';
  let $elm = document.querySelector('.article-section');
  let section;

  beforeEach(function () {
    section = new ArticleSection($elm);
  });

  afterEach(function () {
  });

  it('exists', function () {
    expect(section).to.not.equal(null);
  });

  it('is not initialised if it possesses the css class "article-section--first"', function () {
    $elm.classList.add('article-section--first');
    let articleSection = new ArticleSection($elm);
    expect(articleSection.$headerLink).not.to.exist;
  });

  it('is initialised if it does not possess the css class "article-section--first"', function () {
    $elm.classList.remove('article-section--first');
    let articleSection = new ArticleSection($elm);
    expect(articleSection.$headerLink).to.be.instanceof(HTMLElement);
  });

  it('is initially closed if initial state is closed', function () {
    $elm.dataset.initialState = 'closed';
    let articleSection = new ArticleSection($elm);
    expect(articleSection.$headerLink.classList.contains('article-section__header_link')).to.be.true;
    expect(articleSection.$headerLink.classList.contains('article-section__header_link--closed')).to.be.true;
    expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.true;
  });

  it('is initially open if initial state is not set to closed and viewport is wide enough', function () {
    let initialStateCandidateValues = ['open', 'shut', 'unavailable', 'null', '', 'false'];
    let windowMock = {
      matchMedia: function () {
        return {
          matches: false
        };
      },
      addEventListener: function () {}
    };
    initialStateCandidateValues.forEach((value) => {
      $elm.dataset.initialState = value;
      let articleSection = new ArticleSection($elm, windowMock);
      expect(articleSection.$headerLink.classList.contains('article-section__header_link')).to.be.true;
      expect(articleSection.$headerLink.classList.contains('article-section__header_link--closed')).to.be.false;
      expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.false;
    });
  });

  it('is initially closed if viewport is not wide enough, regardless of initial state', function () {
    let initialStateCandidateValues = ['open', 'shut', 'unavailable', 'null', '', 'false', 'closed'];
    let windowMock = {
      matchMedia: function () {
        return {
          matches: true
        };
      },
      addEventListener: function () {}
    };
    initialStateCandidateValues.forEach((value) => {
      $elm.dataset.initialState = value;
      let articleSection = new ArticleSection($elm, windowMock);
      expect(articleSection.$headerLink.classList.contains('article-section__header_link')).to.be.true;
      expect(articleSection.$headerLink.classList.contains('article-section__header_link--closed')).to.be.true;
      expect(articleSection.$body.classList.contains('visuallyhidden')).to.be.true;
    });
  });

  it('can explicitly open a section', function () {

    let sectionMock = {
      $headerLink: {
        classList: {
          remove: spy()
        }
      },

      $elm: {
        classList: {
          remove: spy()
        }
      },

      $body: {
        classList: {
          remove: spy(),
          contains: function () {}
        }
      }
    };

    ArticleSection.openSection(sectionMock);
    expect(sectionMock.$headerLink.classList.remove.calledOnce).to.be.true;
    expect(sectionMock.$elm.classList.remove.calledOnce).to.be.true;
    expect(sectionMock.$body.classList.remove.calledOnce).to.be.true;
  });

  it('can toggle open state to closed state', function () {
    let eventMock = {
      preventDefault: function () {}
    };
    section.$headerLink.classList.remove('article-section__header_link--closed');
    section.$body.classList.remove('visuallyhidden');
    section.toggleState(eventMock);
    expect(section.$headerLink.classList.contains('article-section__header_link--closed')).to.be.true;
    expect(section.$body.classList.contains('visuallyhidden')).to.be.true;
  });

  it('can toggle closed state to open state', function () {
    let eventMock = {
      preventDefault: function () {}
    };
    section.$headerLink.classList.add('article-section__header_link--closed');
    section.$body.classList.add('visuallyhidden');
    section.toggleState(eventMock);
    expect(section.$headerLink.classList.contains('article-section__header_link--closed')).to.be.false;
    expect(section.$body.classList.contains('visuallyhidden')).to.be.false;
  });

  describe('obtaining the hash', function () {

    let hashBody = 'iAmTheHash';
    let eventMock = {
      newURL: '#' + hashBody
    };

    it('can get the hash from the location', function () {
      let windowMock = {
        matchMedia: function () {
          return {
            matches: false
          };
        },
        addEventListener: function () {},
        location: {
          hash: '#' + hashBody
        }
      };

      let _section = new ArticleSection($elm, windowMock);
      spy(ArticleSection, "isFragmentForCollapsibleSection");
      section.handleSectionOpeningViaHash(eventMock);
      expect(ArticleSection.isFragmentForCollapsibleSection.calledWith(hashBody)).to.be.true;
      ArticleSection.isFragmentForCollapsibleSection.restore();
    });

    it('can get the hash from a hashChanged event', function () {
      spy(ArticleSection, "isFragmentForCollapsibleSection");
      section.handleSectionOpeningViaHash(eventMock);
      expect(ArticleSection.isFragmentForCollapsibleSection.calledWith(hashBody)).to.be.true;
      ArticleSection.isFragmentForCollapsibleSection.restore();
    });

  });


  it('can determine whether a string is a fragment identifier for a collapsible section', function () {

    let docMock = {
      querySelector: function (val) {
        if (val === '#notfound') {
          return false;
        }

        if (val === '#foundNonCollapsible') {
          return {
            dataset: {
              behaviour: '[non-collapsible]'
            }
          };
        }

        if (val === '#foundCollapsible') {
          return {
            dataset: {
              behaviour: 'ArticleSection'
            }
          };
        }

      }

    };

    expect(ArticleSection.isFragmentForCollapsibleSection('notfound', docMock)).to.be.false;
    expect(ArticleSection.isFragmentForCollapsibleSection('foundNonCollapsible', docMock)).to.be.false;
    expect(ArticleSection.isFragmentForCollapsibleSection('foundCollapsible', docMock)).to.be.true;
  });


});
