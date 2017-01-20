let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let Pager = require('../assets/js/components/Pager');
let normalisedDummyData = require('./fixtures/pagerData')();
let normalisedLastPageDummyData = require('./fixtures/pagerData--last-page')();

describe('A Pager', function () {
  'use strict';
  let $elm;
  let $loader;
  let pager;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="Pager"]');
    pager = new Pager($elm, window, window.document);
    $loader = pager.$loader;
  });

  it('exists', function () {
    expect(pager).to.exist;
  });

  it('can target a named page fragment', () => {
    let $target = pager.find$targetEl();
    expect($target).to.be.an.instanceOf(HTMLElement);
    expect($target.id).to.equal('TheTarget');
  });

  it('can normalise a string by stripping leading space and line breaks', () => {
    let data =   '   <div>line 1 \n'
                    + '      line 2 \n'
                    + '      line 3\n'
                    + '   </div>';
    let expectedResult = '<div>line 1 line 2 line 3</div>';
    expect(Pager.normaliseData(data)).to.equal(expectedResult);
  });

  it('can create a documentFragment from a string', () => {
    expect(pager.doc).to.be.an.instanceOf(Document);
    let innerHTML = '<span>some text</span>';
    let str = '<div class="in-fragment">' + innerHTML + '</div>';

    let frag = pager.createDocFragFromString(str);
    expect(frag).to.be.an.instanceOf(DocumentFragment);

    let selectorToElTypeMap = [
      {
        selector: '.in-fragment',
        expectedElementName: 'DIV'
      },
      {
        selector: 'span',
        expectedElementName: 'SPAN'
      }
    ];

    selectorToElTypeMap.forEach((mapping) => {
      let selector = mapping.selector;
      expect(frag.querySelector(selector).nodeName).to.equal(mapping.expectedElementName);
    });
    expect(frag.querySelector('.in-fragment').innerHTML).to.equal(innerHTML);

  });

  it('only tries to load one page\'s-worth of data at a time', () => {
    let eventMock = {
      preventDefault: () => {}
    };
    pager.loadData = spy(() => {
      return {
        then: () => {}
      };
    });

    pager.handleLoadRequest(eventMock);
    expect(pager.loadData.calledOnce).to.be.true;

    // 2nd call to handleLoadRequest doesn't trigger another loadData call before 1st load completes
    pager.handleLoadRequest(eventMock);
    expect(pager.loadData.calledOnce).to.be.true;

  });

  it('has a loader element', () => {
    expect($loader).to.be.instanceOf(HTMLElement);
  });

  describe('its loader element', () => {

    it('is the only child element of the pager', () => {
      expect($loader.nextElementSibling).to.be.null;
      expect($loader.previousElementSibling).to.be.null;
    });

    describe('when not on the last page', () => {

      it('has a link to the next page, correctly derived from the data most recently loaded', () => {
        pager.loaderLink = '';
        pager.updatePager(normalisedDummyData);
        expect(pager.getLoaderLink()).to.equal('/?page=3');
      });

    });

    describe('when on the last page', () => {

      it('it gets removed', () => {
        expect(pager.$loader.parentNode.classList.contains('pager')).to.be.true;
        pager.updatePager(normalisedLastPageDummyData);
        expect(pager.$loader.parentNode).to.be.null;
      });

    });

  });

});
