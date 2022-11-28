'use strict';

let expect = chai.expect;
let spy = sinon.spy;

// load in component(s) to be tested
let ViewSelector = require('../assets/js/components/ViewSelector');

describe('A ViewSelector Component with Tab Selector', function () {
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="ViewSelector"]');
  });

  describe('its clicked button', function () {
    let viewSelector;
    let viewSelectorActiveSelector;
    let classDisplayOnNarrow;

    beforeEach(() => {
      viewSelector = new ViewSelector($elm);
      viewSelectorActiveSelector = 'view-selector__list-item--active';
      classDisplayOnNarrow = 'display-narrow';
    });

    context('when user select button to display section', () => {
      it('only first selector to contains active class', function () {
        viewSelector.addActiveClass(viewSelectorActiveSelector, viewSelector.primarySelector);
        expect(viewSelector.primarySelector.parentNode.classList.contains(viewSelectorActiveSelector)).to.be.true;
        expect(viewSelector.secondarySelector.parentNode.classList.contains(viewSelectorActiveSelector)).to.be.false;
      });

      it('only first section to be visible', function () {
        viewSelector.showSelectedArea(viewSelector.primaryColumn, viewSelector.secondaryColumn, classDisplayOnNarrow);
        expect(viewSelector.primaryColumn.classList.contains(classDisplayOnNarrow)).to.be.false;
        expect(viewSelector.secondaryColumn.classList.contains(classDisplayOnNarrow)).to.be.true;
      });

      it('only second selector to contains active class', function () {
        viewSelector.addActiveClass(viewSelectorActiveSelector, viewSelector.secondarySelector);
        expect(viewSelector.secondarySelector.parentNode.classList.contains(viewSelectorActiveSelector)).to.be.true;
        expect(viewSelector.primarySelector.parentNode.classList.contains(viewSelectorActiveSelector)).to.be.false;
      });

      it('only second section to be visible', function () {
        viewSelector.showSelectedArea(viewSelector.secondaryColumn, viewSelector.primaryColumn, classDisplayOnNarrow);
        expect(viewSelector.secondaryColumn.classList.contains(classDisplayOnNarrow)).to.be.false;
        expect(viewSelector.primaryColumn.classList.contains(classDisplayOnNarrow)).to.be.true;
      });
    });
  });
});
