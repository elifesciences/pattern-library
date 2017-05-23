let expect = chai.expect;

// load in component(s) to be tested
let ContentHeader = require('../assets/js/components/ContentHeader');

describe('A ContentHeader Component', function () {
  'use strict';
  let $elm;
  let contentHeader;

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
    $elm = document.querySelector('[data-behaviour="ContentHeader"]');
    contentHeader = new ContentHeader($elm);
  });

  afterEach(function () {
    $elm = null;
    contentHeader = null;
  });

  it('exists', function () {
    expect(contentHeader).to.exist;
  });

  it('possesses a getDefaultMaxItems() method', function () {
    expect(contentHeader.getDefaultMaxItems).to.be.a('function');
  });

  it('possesses a getExcessItems() method', function () {
    expect(contentHeader.getExcessItems).to.be.a('function');
  });

  it('possesses a markAsExcess() method', function () {
    expect(contentHeader.markAsExcess).to.be.a('function');
  });

  it('possesses a clearExcessMark() method', function () {
    expect(contentHeader.clearExcessMark).to.be.a('function');
  });

  it('possesses a toggleExcessItems() method', function () {
    expect(contentHeader.toggleExcessItems).to.be.a('function');
  });

  describe('the "research" type of ContentHeader', function () {

    describe('the getDefaultMaxItems() method', function () {

      it('returns 9', function () {
        expect(contentHeader.getDefaultMaxItems()).to.equal(9);
      });

    });

    describe('the getExcessItems() method', function () {

      it('returns null if not invoked with argument "authors" nor "institutions"', function () {
        expect(contentHeader.getExcessItems('wrongvalue')).to.be.null;
        expect(contentHeader.getExcessItems(['authors'])).to.be.null;
        expect(contentHeader.getExcessItems(['institutions'])).to.be.null;
        expect(contentHeader.getExcessItems(1000)).to.be.null;
        expect(contentHeader.getExcessItems({ wrong: 'value'})).to.be.null;
        expect(contentHeader.getExcessItems(function () {})).to.be.null;

      });

      it('returns empty array if passed an array of < 10 authors', function () {
        let authorSet = buildItemSet('author', 9);
        let observed = contentHeader.getExcessItems('author', authorSet);
        expect(Array.isArray(observed)).to.be.true;
        expect(observed.length).to.equal(0);
      });

      it('returns empty array if passed an array of < 10 institutions', function () {
        let institutionSet = buildItemSet('institution', 9);
        let observed = contentHeader.getExcessItems('institution', institutionSet);
        expect(Array.isArray(observed)).to.be.true;
        expect(observed.length).to.equal(0);

      });

      it('returns array of the 10th element onwards if passed array of > 9 authors', function () {
        let authorSet = buildItemSet('author', 26);
        let observed = contentHeader.getExcessItems('author', authorSet);
        expect(Array.isArray(observed)).to.be.true;
        expect(observed.length).to.equal(17);
        observed.forEach(function (author, i) {
          expect(observed[i]).to.equal(authorSet[i + 9]);
        });
      });

      it('returns array of the 10th element onwards if passed array of > 9 institutions', function () {
        let institutionSet = buildItemSet('institution', 20);
        let observed = contentHeader.getExcessItems('institution', institutionSet);
        expect(Array.isArray(observed)).to.be.true;
        expect(observed.length).to.equal(11);
        observed.forEach(function (institution, i) {
          expect(observed[i]).to.equal(institutionSet[i + 9]);
      });

      });

    });

    describe('the markAsExcess() method', function () {

      it('adds the CSS class "excess-item" to all items passed to it', function () {
        let fakeEls = [buildFakeElement('li'), buildFakeElement('li'), buildFakeElement('li')];
        contentHeader.markAsExcess(fakeEls);
        fakeEls.forEach(function (elFake) {
          expect(elFake.classList.remove.called).to.be.false;
          expect(elFake.classList.toggle.called).to.be.false;
          expect(elFake.classList.add.calledOnce).to.be.true;
          expect(elFake.classList.add.calledWithExactly('excess-item')).to.be.true;
        });
      });


      it('doesn\'t affect pre-existing classes on the elements passed to it', function () {
        let fakeEl = buildFakeElement('li', ['other-class']);
        contentHeader.markAsExcess([fakeEl]);
        expect(fakeEl.classes.indexOf('other-class')).to.be.above(-1);
      });

    });

    describe('the clearExcessMark() method', function () {

      it('removes the CSS class "excess-item" from all items passed to it', function () {
        let fakeEls = [buildFakeElement('li', ['excess-item']),
                       buildFakeElement('li', ['excess-item']),
                       buildFakeElement('li', ['excess-item'])];
        contentHeader.clearExcessMark(fakeEls);
        fakeEls.forEach(function (elFake) {
          expect(elFake.classList.add.calledOnce).to.be.false;
          expect(elFake.classList.toggle.called).to.be.false;
          expect(elFake.classList.remove.called).to.be.true;
          expect(elFake.classList.remove.calledWithExactly('excess-item')).to.be.true;
        });
      });

      it('doesn\'t affect pre-existing classes on the elements passed to it', function () {
        let fakeEl = buildFakeElement('li', ['other-class']);
        contentHeader.clearExcessMark([fakeEl]);
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
        contentHeader.toggleExcessItems(xsEls);
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
        contentHeader.toggleExcessItems(nonXsEls);
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
