'use strict';

let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let JumpMenu = require('../assets/js/components/JumpMenu');

describe('A JumpMenu Component', function () {
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="JumpMenu"]');
  });

  it('uses the "jump-menu__fixed" css class', function () {
    let jumpMenu = new JumpMenu($elm);
    expect(jumpMenu.cssFixedClassName).to.equal('jump-menu__fixed');
  });

  it('adds and removes the "jump-menu__fixed" class as the page is scrolled', function () {
    let windowMock = {
      addEventListener: function () {},
      matchMedia: function() {
        return {
          matches: true
        }
      },
    };

    let _jumpMenu = new JumpMenu($elm, windowMock);
    expect(_jumpMenu.$elm.classList.contains('jump-menu__fixed')).to.be.false;

    // Note: The 'onScroll' handler is mocked, hence scroll and then manually call the handler.
    window.scrollTo(0,1080);
    _jumpMenu.handleScrolling();
    expect(_jumpMenu.$elm.classList.contains('jump-menu__fixed')).to.be.true;

    // Note: The 'onScroll' handler is mocked, hence scroll and then manually call the handler.
    window.scrollTo(0,0);
    _jumpMenu.handleScrolling();
    expect(_jumpMenu.$elm.classList.contains('jump-menu__fixed')).to.be.false;
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

    let _jumpMenu = new JumpMenu($elm, windowMock, document);
    _jumpMenu.$navDetect = {
      getBoundingClientRect: function () {
        return {
          bottom: fakeBottomOfNavEl
        };
      }
    };
    _jumpMenu.mainTarget = {
      getBoundingClientRect: function () {
        return {
          bottom: fakeBottomOfMainEl
        };
      }
    };
    _jumpMenu.elmYOffset = 20;
    // Prerequisite for the test to be valid
    expect(fakeBottomOfMainEl).to.be.below(_jumpMenu.$elm.offsetHeight);

    _jumpMenu.$elm.classList.add('jump-menu__fixed');
    _jumpMenu.handleScrolling();
    expect(_jumpMenu.$elm.classList.contains('jump-menu__fixed')).to.be.true;
    expect(_jumpMenu.$elm.style.top.indexOf('px')).to.be.above(-1);
  });

  describe("its a list of links for the left navigation", function () {

    let jumpMenu;

    beforeEach(function () {
      jumpMenu = new JumpMenu($elm);
    });

    context('with knowledge of top level article section headings', () => {

      let docFake;
      let winFake;
      let jumpMenu;

      beforeEach(() => {
        docFake = buildFakeDocument(700, 700);
        winFake = buildFakeWindow(700, 700);
        jumpMenu = new JumpMenu($elm);
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
        expect(jumpMenu.findFirstInView(fakeEls, docFake, winFake)).to.deep.equal(fakeEls[0]);
      });

      it('can identify the first section heading in view when it is not the first logical heading', () => {
        const fakeEls = [
          buildFakeElement(-200, 0),
          buildFakeElement(600, 0)
        ];
        expect(jumpMenu.findFirstInView(fakeEls, docFake, winFake)).to.deep.equal(fakeEls[1]);
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

                JumpMenu.findSectionForLinkHighlight(fakeFirstHeading.el, firstHeadingText,
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
          $target = JumpMenu.findLinkToHighlight($elm, `[href="#${$idOfTarget}"]`);
        });

        it('identifies the jump link to the required section', () => {
          expect($target.innerHTML).to.equal('Introduction');
        });

        it('highlights the jump link to the required section', () => {
          JumpMenu.updateHighlighting($target, jumpMenu.links);
          expect($target.classList.contains('jump-menu__active')).to.be.true;
        });

        it('clears the jump link highlight on all but the required section', () => {
          const $notTarget = $elm.querySelector('[href="#metrics"]');
          // Set the class that the OUT should remove
          $notTarget.classList.add('jump-menu__active');
          JumpMenu.updateHighlighting($target, jumpMenu.links);
          expect($notTarget.classList.contains('jump-menu__active')).to.be.false;
          [].forEach.call(jumpMenu.links, ($link) => {
            if ($link.href !== $target.href)
              expect($link.classList.contains('jump-menu__active')).to.be.false;
          });
        });

      });

    });

  });
});
