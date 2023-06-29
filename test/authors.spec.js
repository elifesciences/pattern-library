let expect = chai.expect;

// load in component(s) to be tested
let Authors = require('../assets/js/components/Authors');

describe('An Authors Component', function () {
  'use strict';
  let $elm;
  let authors;

  // Helper functions
  function buildItemSet(itemType, count) {
    let itemSet = [];
    let numToProvide = count;
    for (let i = 0; i < numToProvide; i += 1) {
      itemSet.push(itemType + ' ' + i + ' of ' + numToProvide);
    }
    return itemSet;
  }

  function buildFakeElement(name, classes) {
    let elFake = {};
    elFake.classes = Array.isArray(classes) ? classes : [];
    elFake.classList = {
      add: sinon.spy(),
      contains: function(className) {
        return elFake.classes.indexOf(className) > -1;
      },
      remove: sinon.spy(),
      toggle: sinon.spy()
    };
    return elFake;
  }

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="Authors"]');
    authors = new Authors($elm);
  });

  afterEach(function () {
    $elm = null;
    authors = null;
  });

  it('exists', function () {
    expect(authors).to.exist;
  });

  it('possesses a getMaxItems() method', function () {
    expect(authors.getMaxItems).to.be.a('function');
  });

  it('possesses a getExcessItems() method', function () {
    expect(authors.getExcessItems).to.be.a('function');
  });

  it('possesses a getUpdatedToggleText() method', function () {
    expect(authors.getExcessItems).to.be.a('function');
  });

  it('possesses a markAsExcess() method', function () {
    expect(authors.markAsExcess).to.be.a('function');
  });

  it('possesses a clearExcessMark() method', function () {
    expect(authors.clearExcessMark).to.be.a('function');
  });

  it('possesses a toggleExcessItems() method', function () {
    expect(authors.toggleExcessItems).to.be.a('function');
  });

  describe('the "research" type of Authors', function () {

    describe('the getExcessItems() method', function () {

      it('returns null if not invoked with argument "authors" nor "institutions"', function () {
        expect(authors.getExcessItems('wrongvalue')).to.be.null;
        expect(authors.getExcessItems(['authors'])).to.be.null;
        expect(authors.getExcessItems(['institutions'])).to.be.null;
        expect(authors.getExcessItems(1000)).to.be.null;
        expect(authors.getExcessItems({wrong: 'value'})).to.be.null;
        expect(authors.getExcessItems(function () {
        })).to.be.null;

      });

    });

    describe('the markAsExcess() method', function () {

      it('adds the CSS class "excess-item" to all items passed to it', function () {
        let fakeEls = [buildFakeElement('li'), buildFakeElement('li'), buildFakeElement('li')];
        authors.markAsExcess(fakeEls);
        fakeEls.forEach(function (elFake) {
          expect(elFake.classList.remove.called).to.be.false;
          expect(elFake.classList.toggle.called).to.be.false;
          expect(elFake.classList.add.calledOnce).to.be.true;
          expect(elFake.classList.add.calledWithExactly('excess-item')).to.be.true;
        });
      });


      it('doesn\'t affect pre-existing classes on the elements passed to it', function () {
        let fakeEl = buildFakeElement('li', ['other-class']);
        authors.markAsExcess([fakeEl]);
        expect(fakeEl.classes.indexOf('other-class')).to.be.above(-1);
      });

    });

    describe('the clearExcessMark() method', function () {

      it('removes the CSS class "excess-item" from all items passed to it', function () {
        let fakeEls = [buildFakeElement('li', ['excess-item']),
                       buildFakeElement('li', ['excess-item']),
                       buildFakeElement('li', ['excess-item'])];
        authors.clearExcessMark(fakeEls);
        fakeEls.forEach(function (elFake) {
          expect(elFake.classList.add.calledOnce).to.be.false;
          expect(elFake.classList.toggle.called).to.be.false;
          expect(elFake.classList.remove.called).to.be.true;
          expect(elFake.classList.remove.calledWithExactly('excess-item')).to.be.true;
        });
      });

      it('doesn\'t affect pre-existing classes on the elements passed to it', function () {
        let fakeEl = buildFakeElement('li', ['other-class']);
        authors.clearExcessMark([fakeEl]);
        expect(fakeEl.classes.indexOf('other-class')).to.be.above(-1);
      });


    });

    describe('the toggleExcessItems() method', function () {

      it('toggles the CSS class "visuallyhidden" on all items passed if they are an "excess-item"',  function () {

        let xsEls = [
          buildFakeElement('a', ['excess-item']),
          buildFakeElement('a', ['excess-item', 'visuallyhidden']),
          buildFakeElement('li', ['excess-item', 'other-class-1']),
          buildFakeElement('li', ['excess-item', 'visuallyhidden', 'other-class-1']),
          buildFakeElement('div', ['excess-item', 'other-class-1', 'other-class-2']),
          buildFakeElement('div', ['excess-item', 'visuallyhidden', 'other-class-1', 'other-class-2'])
        ];
        authors.toggleExcessItems(xsEls);
        xsEls.forEach(function (el) {
          expect(el.classList.add.calledOnce).to.be.true;
          expect(el.classList.add.calledWith('visuallyhidden')).to.be.true;
          expect(el.classList.remove.called).is.false;
          expect(el.classList.toggle.called).is.false;
        });

       });

      it('doesn\'t affect element\'s "visuallyhidden" class (adding or removing) if not an "excess-item"', function () {

        let nonXsEls = [
          buildFakeElement('a'),
          buildFakeElement('a', ['visuallyhidden']),
          buildFakeElement('li', ['other-class-1']),
          buildFakeElement('li', ['visuallyhidden', 'other-class-1']),
          buildFakeElement('div', ['other-class-1', 'other-class-2']),
          buildFakeElement('div', ['visuallyhidden', 'other-class-1', 'other-class-2'])
        ];
        authors.toggleExcessItems(nonXsEls);
        nonXsEls.forEach(function (el) {
          expect(el.classList.add.called).is.false;
          expect(el.classList.toggle.called).is.false;
          expect(el.classList.remove.calledOnce).is.true;
          expect(el.classList.remove.calledWith('visuallyhidden')).is.true;
        });

      });

    });

    context('when the width is narrow', () => {

      let windowMock;
      let authorsNarrow;

      beforeEach(() => {
        windowMock = {
          matchMedia: (statement) => {
            if (statement === '(min-width: 730px)') {
              return {
                matches: false
              };
            }
            return true;
          },
          addEventListener: () => {}
        };
        authorsNarrow = new Authors($elm, windowMock);
      });

      describe('the getAuthorsCount() method', function () {

        context('when there are exactly 2 authors', () => {

          it('returns 2', function () {
            authorsNarrow.authors = [
              buildFakeElement('div', ['author_list_item']),
              buildFakeElement('div', ['author_list_item'])
            ];
            expect(authorsNarrow.getAuthorsCount()).to.equal(2);
          });

        });

        context('when there are more authors', () => {

          it('returns authors lenght', function () {
            expect(authorsNarrow.getAuthorsCount()).to.equal(authorsNarrow.authors.length);
          });

        });

      });

      describe('the getUpdatedToggleText() method', () => {

        it('returns the correct toggle text when expanded', () => {
          const expected = '<span class="visuallyhidden"> collapse author list</span><span aria-hidden="true">see&nbsp;less</span>';
          expect(authorsNarrow.getUpdatedToggleText('expanded')).to.equal(expected);
        });

        it('returns the correct toggle text when collapsed', () => {
          const expected = 'et al.<span class="visuallyhidden"> expand author list</span>';
          expect(authorsNarrow.getUpdatedToggleText('collapsed')).to.equal(expected);
        });

      });

    });


    context('when the width is not narrow', () => {

      let windowMock;
      let authorsNotNarrow;

      beforeEach(() => {
        windowMock = {
          matchMedia: (statement) => {
            if (statement === '(min-width: 730px)') {
              return {
                matches: true
              };
            }
            return false;
          },
          addEventListener: () => {}
        };
        authorsNotNarrow = new Authors($elm, windowMock);
      });

      describe('the getMaxItems() method', function () {

        it('returns 9', function () {
          expect(authorsNotNarrow.getMaxItems()).to.equal(9);
        });

      });

      describe('the getUpdatedToggleText() method', () => {

        it('returns the correct toggle text when expanded', () => {
          const expected = '<span class="visuallyhidden"> collapse author list</span><span aria-hidden="true">see&nbsp;less</span>';
          expect(authorsNotNarrow.getUpdatedToggleText('expanded')).to.equal(expected);
        });

        it('returns the correct toggle text when collapsed', () => {
          const expected = '<span class="visuallyhidden"> expand author list</span><span aria-hidden="true">see&nbsp;all</span>';
          expect(authorsNotNarrow.getUpdatedToggleText('collapsed')).to.equal(expected);
        });

      });

      describe('the getExcessItems() method', function () {

        it('returns empty array if passed an array of < 10 institutions', function () {
          let institutionSet = buildItemSet('institution', 9);
          let observed = authorsNotNarrow.getExcessItems('institution', institutionSet);
          expect(Array.isArray(observed)).to.be.true;
          expect(observed.length).to.equal(0);

        });

        it('returns array of the 10th element onwards if passed array of > 9 institutions', function () {
          let institutionSet = buildItemSet('institution', 20);
          let observed = authorsNotNarrow.getExcessItems('institution', institutionSet);
          expect(Array.isArray(observed)).to.be.true;
          expect(observed.length).to.equal(11);
          observed.forEach(function (institution, i) {
            expect(observed[i]).to.equal(institutionSet[i + 9]);
          });

        });

      });


    });

  });

});
