let expect = chai.expect;

// load in component(s) to be tested
let ContentHeaderArticle = require('../assets/js/components/ContentHeaderArticle');

describe('A ContentHeaderArticle Component', function () {
  'use strict';
  let $elm;
  let breakpoint;
  let contentHeaderArticle;

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
    $elm = document.querySelector('[data-behaviour="ContentHeaderArticle"]');
    contentHeaderArticle = new ContentHeaderArticle($elm);
    breakpoint = '560px';
  });

  afterEach(function () {
    $elm = null;
    contentHeaderArticle = null;
    breakpoint = null;
  });

  it('exists', function () {
    expect(contentHeaderArticle).to.exist;
  });

  it('possesses a getDefaultMaxItems() method', function () {
    expect(contentHeaderArticle.getDefaultMaxItems).to.be.a('function');
  });

  it('possesses a getExcessItems() method', function () {
    expect(contentHeaderArticle.getExcessItems).to.be.a('function');
  });

  it('possesses a markAsExcess() method', function () {
    expect(contentHeaderArticle.markAsExcess).to.be.a('function');
  });

  it('possesses a clearExcessMark() method', function () {
    expect(contentHeaderArticle.clearExcessMark).to.be.a('function');
  });

  it('possesses a toggleExcessItems() method', function () {
    expect(contentHeaderArticle.toggleExcessItems).to.be.a('function');
  });

  it('possesses an calcCurrentView() method', function () {
    expect(contentHeaderArticle.calcCurrentView).to.be.a('function');
  });

  describe('the "research" type of ContentHeaderArticle', function () {

    describe('the getDefaultMaxItems() method', function () {

      describe('When the viewport is narrower than the threshold', function () {

        beforeEach(function () {
          contentHeaderArticle.currentView = 'narrow';
        });
        
        it('returns 1 when invoked with "author"', function () {
          expect(contentHeaderArticle.getDefaultMaxItems('author')).to.equal(1);
        });

        it('returns 0 when invoked with "institution"', function () {
          expect(contentHeaderArticle.getDefaultMaxItems('institution')).to.equal(0);
        });

        it('returns null when invoked with neither "institution" nor "author"', function () {
          expect(contentHeaderArticle.getDefaultMaxItems('wrong value')).to.be.null;
        });
      });

      describe('When the viewport is at least as wide as the threshold', function () {

        beforeEach(function () {
          contentHeaderArticle.currentView = 'wide';
        });

        it('returns 16 when invoked with "author"', function () {
          expect(contentHeaderArticle.getDefaultMaxItems('author')).to.equal(16);
        });

        it('returns 10 when invoked with "institutions"', function () {
          expect(contentHeaderArticle.getDefaultMaxItems('institution')).to.equal(10);
        });

      });

    });

    describe('the getExcessItems() method', function () {

      it('returns null if not invoked with argument "authors" nor "institutions"', function () {
        expect(contentHeaderArticle.getExcessItems('wrongvalue')).to.be.null;
        expect(contentHeaderArticle.getExcessItems(['authors'])).to.be.null;
        expect(contentHeaderArticle.getExcessItems(['institutions'])).to.be.null;
        expect(contentHeaderArticle.getExcessItems(1000)).to.be.null;
        expect(contentHeaderArticle.getExcessItems({ wrong: 'value'})).to.be.null;
        expect(contentHeaderArticle.getExcessItems(function () {})).to.be.null;

      });

      describe('When the viewport is narrower than the threshold', function () {

        beforeEach(function () {
          contentHeaderArticle.currentView = 'narrow';
        });

        it('returns array of all but the first item when passed an array of 1 or more authors', function () {

          let authorSets = [
            buildItemSet('author', 1),
            buildItemSet('author', 2),
            buildItemSet('author', 3),
            buildItemSet('author', 4)
          ];

          authorSets.forEach(function (authorSet) {
            let observed = contentHeaderArticle.getExcessItems('author', authorSet);
            expect(Array.isArray(observed)).to.be.true;
            expect(observed.length).to.equal(authorSet.length - 1);

            // When passing > 1 author, so observed is a non-empty array.
            if (observed.length) {
              authorSet.forEach(function (author, i) {
                if (i > 0) {
                  expect(observed).to.include(author);
                }
              });
            }
          });
        });

        it('returns the whole array when passed an array of any number of institutions', function () {
          let institutionSets = [
            buildItemSet('institution', 1),
            buildItemSet('institution', 2),
            buildItemSet('institution', 3),
            buildItemSet('institution', 4)
          ];
          institutionSets.forEach(function (institutionSet) {
            let observed = contentHeaderArticle.getExcessItems('institution', institutionSet);
            expect(Array.isArray(observed)).to.be.true;
            expect(observed.length).to.equal(institutionSet.length);
            institutionSet.forEach(function (institution) {
              expect(observed).to.include(institution);
            });
          });
        });

      });

      describe('When the viewport is at least as wide as the threshold', function () {

        beforeEach(function () {
          contentHeaderArticle.currentView = 'wide';
        });

        it('returns empty array if passed an array of < 17 authors', function () {
          let authorSet = buildItemSet('author', 16);
          let observed = contentHeaderArticle.getExcessItems('author', authorSet);
          expect(Array.isArray(observed)).to.be.true;
          expect(observed.length).to.equal(0);
        });

        it('returns empty array if passed an array of < 11 institutions', function () {
          let institutionSet = buildItemSet('institution', 10);
          let observed = contentHeaderArticle.getExcessItems('institution', institutionSet);
          expect(Array.isArray(observed)).to.be.true;
          expect(observed.length).to.equal(0);

        });

        it('returns array of the 17th element onwards if passed array of > 16 authors', function () {
          let authorSet = buildItemSet('author', 26);
          let observed = contentHeaderArticle.getExcessItems('author', authorSet);
          expect(Array.isArray(observed)).to.be.true;
          expect(observed.length).to.equal(10);
          observed.forEach(function (author, i) {
            expect(observed[i]).to.equal(authorSet[i + 16]);
          });
        });

        it('returns array of the 11th element onwards if passed array of > 10 institutions', function () {
          let institutionSet = buildItemSet('institution', 20);
          let observed = contentHeaderArticle.getExcessItems('institution', institutionSet);
          expect(Array.isArray(observed)).to.be.true;
          expect(observed.length).to.equal(10);
          observed.forEach(function (institution, i) {
            expect(observed[i]).to.equal(institutionSet[i + 10]);
          });
        });

      });

    });

    describe('the markAsExcess() method', function () {

      it('adds the CSS class "excess-item" to all items passed to it', function () {
        let fakeEls = [buildFakeElement('li'), buildFakeElement('li'), buildFakeElement('li')];
        contentHeaderArticle.markAsExcess(fakeEls);
        fakeEls.forEach(function (elFake) {
          expect(elFake.classList.remove.called).to.be.false;
          expect(elFake.classList.toggle.called).to.be.false;
          expect(elFake.classList.add.calledOnce).to.be.true;
          expect(elFake.classList.add.calledWithExactly('excess-item')).to.be.true;
        });
      });


      it('doesn\'t affect pre-existing classes on the elements passed to it', function () {
        let fakeEl = buildFakeElement('li', ['other-class']);
        contentHeaderArticle.markAsExcess([fakeEl]);
        expect(fakeEl.classes.indexOf('other-class')).to.be.above(-1);
      });

    });

    describe('the clearExcessMark() method', function () {

      it('removes the CSS class "excess-item" from all items passed to it', function () {
        let fakeEls = [buildFakeElement('li', ['excess-item']),
                       buildFakeElement('li', ['excess-item']),
                       buildFakeElement('li', ['excess-item'])];
        contentHeaderArticle.clearExcessMark(fakeEls);
        fakeEls.forEach(function (elFake) {
          expect(elFake.classList.add.calledOnce).to.be.false;
          expect(elFake.classList.toggle.called).to.be.false;
          expect(elFake.classList.remove.called).to.be.true;
          expect(elFake.classList.remove.calledWithExactly('excess-item')).to.be.true;
        });
      });

      it('doesn\'t affect pre-existing classes on the elements passed to it', function () {
        let fakeEl = buildFakeElement('li', ['other-class']);
        contentHeaderArticle.clearExcessMark([fakeEl]);
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
        contentHeaderArticle.toggleExcessItems(xsEls);
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
        contentHeaderArticle.toggleExcessItems(nonXsEls);
        nonXsEls.forEach(function (el) {
          expect(el.classList.add.called).is.false;
          expect(el.classList.toggle.called).is.false;
          expect(el.classList.remove.calledOnce).is.true;
          expect(el.classList.remove.calledWith('visuallyhidden')).is.true;
        });

      });

    });

  });

});
