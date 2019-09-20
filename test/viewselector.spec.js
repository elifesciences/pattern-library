let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let ViewSelector = require('../assets/js/components/ViewSelector');

describe('A ViewSelector Component', function () {
  'use strict';
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="ViewSelector"]');
  });

  afterEach(function () {
    [].forEach.call($elm.querySelectorAll('.view-selector__list-item--side-by-side'), ($li) => {
      $li.remove();
    });
  });

  it('uses the "view-selector--fixed" css class', function () {
    let viewSelector = new ViewSelector($elm);
    expect(viewSelector.cssFixedClassName).to.equal('view-selector--fixed');
  });

  it('has a toggleable list of jump links', function () {
    let viewSelector = new ViewSelector($elm);
    expect(viewSelector.$jumpLinksList instanceof HTMLElement).to.be.true;
    expect(viewSelector.toggleJumpLinks).to.be.a('function');
  });

  describe('the "view-selector--fixed" class', function () {

    it('is added and contextual-data class is showing in the browser', function () {
      // Fake sufficient scrolling
      let windowMock = {
      addEventListener: function () {
      },
      matchMedia: function() {
        return {
          matches: true
        };
      },
      IntersectionObserver: function () {
        return {
          observe: function () {

          }
        };
      }
    };
      let _viewSelector1 = new ViewSelector($elm, windowMock);
      _viewSelector1.$elm.classList.add('contextual-data');
      _viewSelector1.handleVerticalPositioning();

      let classes1 = _viewSelector1.$elm.classList;
      expect(classes1.contains('contextual-data')).to.be.true;
    });

    it('is added and contextual-data class not showing in the browser', function () {
      // Fake sufficient scrolling
      let windowMock = {
      addEventListener: function () {
      },
      matchMedia: function() {
        return {
          matches: true
        };
      },
      IntersectionObserver: function () {
        return {
          observe: function () {

          }
        };
      }
    };
      let _viewSelector1 = new ViewSelector($elm, windowMock);
      _viewSelector1.handleVerticalPositioning();

      let classes1 = _viewSelector1.$elm.classList;
      classes1.remove('contextual-data');
      expect(classes1.contains('contextual-data')).to.be.false;

    });

  });

  describe("its toggleable list of jump links", function () {

    let viewSelector;
    let windowMock = {
      addEventListener: function () {
      },
      matchMedia: function() {
        return {
          matches: true
        }
      },
      IntersectionObserver: function () {
        return {
          observe: function () {

          }
        }
      }
    };
    beforeEach(function () {
      viewSelector = new ViewSelector($elm, windowMock);
    });

    it('expands when toggled open', function () {
      viewSelector.$jumpLinksList.classList.add('visuallyhidden');
      viewSelector.$jumpLinksToggle.classList.add('view-selector__jump_links_header--closed');
      viewSelector.toggleJumpLinks();
      expect(viewSelector.$jumpLinksList.classList.contains('visuallyhidden')).to.be.false;
      expect(viewSelector.$jumpLinksToggle.classList
      .contains('view-selector__jump_links_header--closed')).to.be.false;
    });

    it('collapses when toggled closed', function () {
      viewSelector.$jumpLinksList.classList.remove('visuallyhidden');
      viewSelector.$jumpLinksToggle.classList.remove('view-selector__jump_links_header--closed');
      viewSelector.toggleJumpLinks();
      expect(viewSelector.$jumpLinksList.classList.contains('visuallyhidden')).to.be.true;
      expect(viewSelector.$jumpLinksToggle.classList
                         .contains('view-selector__jump_links_header--closed')).to.be.true;
    });

    context('with knowledge of top level article section headings', () => {

      let docFake;
      let winFake;
      let viewSelector;
      let windowMock = {
      addEventListener: function () {
      },
      matchMedia: function() {
        return {
          matches: true
        }
      },
      IntersectionObserver: function () {
        return {
          observe: function () {

          }
        }
      }
    };

      beforeEach(() => {
        docFake = buildFakeDocument(700, 700);
        winFake = buildFakeWindow(700, 700);
        viewSelector = new ViewSelector($elm, windowMock);
      });

      const buildFakeElement = function (top, left, innerHTML) {
        return {
          getBoundingClientRect: function () {
            return {
              top: top,
              left: left
            };
          },
          innerHTML: innerHTML
        };
      };

      const buildFakeDocument = function (height, width) {
        return {
          documentElement: {
            clientHeight: height,
            clientWidth: width
          }
        };
      };

      const buildFakeWindow = function (height, width) {
        return {
          innerHeight: height,
          innerWidth: width
        };
      };

      it('can identify the first section heading in view when it is the first logical heading', () => {
        const fakeEls = [
          buildFakeElement(0, 0),
          buildFakeElement(200, 0)
        ];
        expect(viewSelector.findFirstInView(fakeEls, docFake, winFake)).to.deep.equal(fakeEls[0]);
      });

      it('can identify the first section heading in view when it is not the first logical heading', () => {
        const fakeEls = [
          buildFakeElement(-200, 0),
          buildFakeElement(600, 0)
        ];
        expect(viewSelector.findFirstInView(fakeEls, docFake, winFake)).to.deep.equal(fakeEls[1]);
      });

      describe('identifying a section to highlight the link to', () => {

        let firstHeadingText;

        beforeEach(() => {
          firstHeadingText = 'Text of the first heading';
        });

        context('when the first viewable section heading is the first logical section heading', () => {

          it('identifies the first section heading as the section to highlight the link to, regardless of the heading\'s top position',
             () => {
              const elPositions = [ { top: 0, left: 0 }, { top: 60, left: 0 } ];
              elPositions.forEach((position) => {
                const fakeFirstHeading = {
                  el: buildFakeElement(position.top, position.left, firstHeadingText),
                  findClosest: function () {
                    return {
                      previousElementSibling: 'I am the previousElementSibling'
                    };
                  }
                };
                spy(fakeFirstHeading, 'findClosest');

                ViewSelector.findSectionForLinkHighlight(fakeFirstHeading.el, firstHeadingText,
                                                         fakeFirstHeading.findClosest);
                expect(fakeFirstHeading.findClosest.calledWithExactly(fakeFirstHeading.el,
                                                                      '.article-section')).to.be.true;
                expect(fakeFirstHeading.findClosest.returned(
                  {previousElementSibling: 'I am the previousElementSibling'})).to.be.true;
                fakeFirstHeading.findClosest.restore();
              });

           });

        });

        context('when the first viewable section heading is not the first logical section heading', () => {

          context(
            'and it is less than 48px lower than the top of the top of the viewport',
            () => {

              const fakeSecondHeading = {
                el: buildFakeElement(47, 0, 'Second heading text'),
                findClosest: function () {
                  return {
                    previousElementSibling: 'I am the previousElementSibling'
                  };
                }
              };
              spy(fakeSecondHeading, 'findClosest');

              it(
                'identifies that section heading\'s section as the section to highlight the link to',
                () => {
                  ViewSelector.findSectionForLinkHighlight(fakeSecondHeading.el, firstHeadingText,
                                                           fakeSecondHeading.findClosest);
                  expect(fakeSecondHeading.findClosest.calledWithExactly(fakeSecondHeading.el,
                                                                        '.article-section')).to.be.true;
                  expect(fakeSecondHeading.findClosest.returned(
                    {previousElementSibling: 'I am the previousElementSibling'})).to.be.true;
                  fakeSecondHeading.findClosest.restore();
                });

            });

          context(
            'and it is 48px or more below the top of the viewport',
            () => {

              const fakeSecondHeading = {
                el: buildFakeElement(48, 0, 'Second heading text'),
                findClosest: function () {
                  return {
                    previousElementSibling: 'I am the previousElementSibling'
                  };
                }
              };
              spy(fakeSecondHeading, 'findClosest');

              it(
                'identifies the section following the section heading\'s section as the section to highlight the link to',
                () => {
                  const obs = ViewSelector.findSectionForLinkHighlight(fakeSecondHeading.el, firstHeadingText,
                                                           fakeSecondHeading.findClosest);
                  expect(fakeSecondHeading.findClosest.calledWithExactly(fakeSecondHeading.el,
                                                                         '.article-section')).to.be.true;
                  expect(obs).to.equal('I am the previousElementSibling');
                  fakeSecondHeading.findClosest.restore();
                });

            });

        });

      });

      describe('identification of the section link to highlight', () => {

        let $target;
        let $idOfTarget;

        beforeEach(() => {
          $idOfTarget = 'introduction';
          $target = ViewSelector.findLinkToHighlight($elm, `[href="#${$idOfTarget}"]`);
        });

        it('identifies the jump link to the required section', () => {
          expect($target.innerHTML).to.equal('Introduction');
        });

        it('highlights the jump link to the required section', () => {
          ViewSelector.updateHighlighting($target, viewSelector.jumpLinks);
          expect($target.classList.contains('view-selector__jump_link--active')).to.be.true;
        });

        it('clears the jump link highlight on all but the required section', () => {
          const $notTarget = $elm.querySelector('[href="#results"]');
          // Set the class that the OUT should remove
          $notTarget.classList.add('view-selector__jump_link--active');
          ViewSelector.updateHighlighting($target, viewSelector.jumpLinks);
          expect($notTarget.classList.contains('view-selector__jump_link--active')).to.be.false;
          [].forEach.call(viewSelector.jumpLinks, ($link) => {
            if ($link.href !== $target.href)
              expect($link.classList.contains('view-selector__jump_link--active')).to.be.false;
          });
        });

      });

    });

    it('maintains a list of top level article section headings', () => {
      const expectedHeadingList = ['headingOne', 'headingTwo'];
      const doc = {
        querySelectorAll: () => {
          return expectedHeadingList;
        }
      };
      spy(doc, 'querySelectorAll');
      const headingList = ViewSelector.getAllCollapsibleSectionHeadings(doc);
      expect(doc.querySelectorAll.calledWithExactly(
        '[data-behaviour="ArticleSection"] > .article-section__header .article-section__header_text')).to.be.true;
      expect(headingList).to.have.length(2);
      expect(headingList).to.equal(expectedHeadingList);
      doc.querySelectorAll.restore();

    });

  });

  describe('its side-by-side link', function () {

    let viewSelector;
    let windowMock;

    beforeEach(() => {
      windowMock = {
        CSS: {
          supports: () => true
        },
        addEventListener: function () {
        },
        matchMedia: function() {
          return {
            matches: true
          }
        },
        IntersectionObserver: function () {
          return {
            observe: function () {

            }
          }
        }
      };
      viewSelector = new ViewSelector($elm, windowMock);
    });

    context('when the browser can display the side by side view', () => {

      it('is displayed on load', function () {
        const link = $elm.querySelector('.view-selector__link--side-by-side');
        expect(link).to.not.be.null;
        expect(link.textContent).to.equal('Side by side');
        expect(link.href).to.equal('https://lens.elifesciences.org/19749/index.html');
      });

      it('opens an iframe', function () {
        const link = $elm.querySelector('.view-selector__link--side-by-side');
        link.click();
        expect(viewSelector.sideBySideView.$iframe).to.not.be.undefined;
        expect(viewSelector.sideBySideView.$iframe.classList.contains('hidden')).to.be.false;
      });

    });

    context('when the browser cannot display the side by side view', () => {

      it('is not displayed if the link is not supplied', function () {
        $elm.dataset.sideBySideLink = '';
        expect(viewSelector.sideBySideViewAvailable()).to.be.false;
      });

      it('is not displayed if the link looks broken', function () {
        $elm.dataset.sideBySideLink = 'localhost/null';
        expect(viewSelector.sideBySideViewAvailable()).to.be.false;
      });

      it('is not displayed if the browser is probably Edge or IE', function () {
        // Explicity fail the capability check used to determine whether the link is displayed
        window.CSS.supports = (property, value) => {
          if (property === 'text-orientation' || property === '-webkit-text-orientation') {
            if (value === 'sideways') {
              return false;
            }
          }
          return true;
        };

        expect(new ViewSelector($elm, window).sideBySideViewAvailable()).to.be.false;

        window.CSS.supports = null;
        expect(new ViewSelector($elm, window).sideBySideViewAvailable()).to.be.false;

        window.CSS = null;
        expect(new ViewSelector($elm, window).sideBySideViewAvailable()).to.be.false;
      });

    });
  });


});
