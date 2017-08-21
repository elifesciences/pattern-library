const expect = chai.expect;
const spy = sinon.spy;

// load in component(s) to be tested
const FilterPanel = require('../assets/js/components/FilterPanel');

const buildFilterMock = (hasForm) => {
  return {
    addEventListener: spy(),
    form: !!hasForm
  };
};

describe('A FilterPanel', function () {
  'use strict';
  let $elm;
  let filterPanel;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="FilterPanel"]');
    filterPanel = new FilterPanel($elm, window, window.document);
  });

  it('exists', function () {
    expect(filterPanel).to.exist;
  });

  it('hides the submit button', function () {
    expect(filterPanel.$button.classList.contains('visuallyhidden')).to.be.true;
  });

  it('finds the correct number of filters', () => {
    expect(FilterPanel.findFilters($elm)).to.have.length(10);
  });

  describe('a filter', () => {

    context('when it lacks a form property', () => {
      it('does not have an onchange event listener attached', () => {
        const filterMockWithoutForm = buildFilterMock(false);
        FilterPanel.setupEventListeners([filterMockWithoutForm]);
        expect(filterMockWithoutForm.addEventListener.notCalled).to.be.true;
      });
    });

    context('when it has a form property', () => {
      it('has an onchange event listener attached', () => {
        const filterMock = buildFilterMock(true);
        FilterPanel.setupEventListeners([filterMock]);
        expect(filterMock.addEventListener.calledOnce).to.be.true;
        expect(filterMock.addEventListener.getCall(0).args[0]).to.equal('change');
        expect(filterMock.addEventListener.getCall(0).args[1]).to.be.a('function');
      });
    });



  });



});
