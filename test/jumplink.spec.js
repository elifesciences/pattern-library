'use strict';

let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let JumpLink = require('../assets/js/components/JumpLink');

describe('A JumpLink Component', function () {
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="JumpLink"]');
  });

  it('uses the "jump-link__fixed" css class', function () {
    let jumpLink = new JumpLink($elm);
    expect(jumpLink.cssFixedClassName).to.equal('jump-link__fixed');
  });

  it('adds and removes the "jump-link__fixed" class as the page is scrolled', function () {
    let windowMock = {
      addEventListener: function () {},
      matchMedia: function() {
        return {
          matches: true
        }
      },
    };

    let _jumpLink = new JumpLink($elm, windowMock);
    expect(_jumpLink.$elm.classList.contains('jump-link__fixed')).to.be.false;

    // Note: The 'onScroll' handler is mocked, hence scroll and then manually call the handler.
    window.scrollTo(0,1080);
    _jumpLink.handleScrolling();
    expect(_jumpLink.$elm.classList.contains('jump-link__fixed')).to.be.true;

    // Note: The 'onScroll' handler is mocked, hence scroll and then manually call the handler.
    window.scrollTo(0,0);
    _jumpLink.handleScrolling();
    expect(_jumpLink.$elm.classList.contains('jump-link__fixed')).to.be.false;
  });

  it('is removed when scrolling would cause view selector to overlay following layout elements', function () {
    // This must be smaller than $elm.offsetHeight of the object under test
    let fakeBottomOfNavEl = -20;
    let fakeBottomOfMainEl = 20;
    let windowMock = {
      addEventListener: function () {
      },
      matchMedia: function() {
        return {
          matches: true
        }
      }
    };

    let _jumpLink = new JumpLink($elm, windowMock, document);
    _jumpLink.$navDetect = {
      getBoundingClientRect: function () {
        return {
          bottom: fakeBottomOfNavEl
        };
      }
    };
    _jumpLink.mainTarget = {
      getBoundingClientRect: function () {
        return {
          bottom: fakeBottomOfMainEl
        };
      }
    };
    _jumpLink.elmYOffset = 20;
    // Prerequisite for the test to be valid
    expect(fakeBottomOfMainEl).to.be.below(_jumpLink.$elm.offsetHeight);

    _jumpLink.$elm.classList.add('jump-link__fixed');
    _jumpLink.handleScrolling();
    expect(_jumpLink.$elm.classList.contains('jump-link__fixed')).to.be.true;
    expect(_jumpLink.$elm.style.top.indexOf('px')).to.be.above(-1);
  });

  describe("its a list of links for the left navigation", function () {

    let jumpLink;

    beforeEach(function () {
      jumpLink = new JumpLink($elm);
    });

    context('with knowledge of top level article section headings', () => {

      let docFake;
      let winFake;
      let jumpLink;

      beforeEach(() => {
        docFake = buildFakeDocument(700, 700);
        winFake = buildFakeWindow(700, 700);
        jumpLink = new JumpLink($elm);
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
        expect(jumpLink.findFirstInView(fakeEls, docFake, winFake)).to.deep.equal(fakeEls[0]);
      });

      it('can identify the first section heading in view when it is not the first logical heading', () => {
        const fakeEls = [
          buildFakeElement(-200, 0),
          buildFakeElement(600, 0)
        ];
        expect(jumpLink.findFirstInView(fakeEls, docFake, winFake)).to.deep.equal(fakeEls[1]);
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

                JumpLink.findSectionForLinkHighlight(fakeFirstHeading.el, firstHeadingText,
                                                         fakeFirstHeading.findClosest);
                expect(fakeFirstHeading.findClosest.calledWithExactly(fakeFirstHeading.el,
                                                                      '.article-section')).to.be.true;
                expect(fakeFirstHeading.findClosest.returned(
                  {previousElementSibling: 'I am the previousElementSibling'})).to.be.true;
                fakeFirstHeading.findClosest.restore();
              });

           });

        });

      });

      describe('identification of the section link to highlight', () => {

        let $target;
        let $idOfTarget;

        beforeEach(() => {
          $idOfTarget = 'introduction';
          $target = JumpLink.findLinkToHighlight($elm, `[href="#${$idOfTarget}"]`);
        });

        it('identifies the jump link to the required section', () => {
          expect($target.innerHTML).to.equal('Introduction');
        });

        it('highlights the jump link to the required section', () => {
          JumpLink.updateHighlighting($target, jumpLink.links);
          expect($target.classList.contains('jump-link__active')).to.be.true;
        });

        it('clears the jump link highlight on all but the required section', () => {
          const $notTarget = $elm.querySelector('[href="#metrics"]');
          // Set the class that the OUT should remove
          $notTarget.classList.add('jump-link__active');
          JumpLink.updateHighlighting($target, jumpLink.links);
          expect($notTarget.classList.contains('jump-link__active')).to.be.false;
          [].forEach.call(jumpLink.links, ($link) => {
            if ($link.href !== $target.href)
              expect($link.classList.contains('jump-link__active')).to.be.false;
          });
        });

      });

    });

  });
});
