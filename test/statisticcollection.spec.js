'use strict';

const expect = chai.expect;
const spy = sinon.spy;

// load in component(s) to be tested
let StatisticCollection = require('../assets/js/components/StatisticCollection');

describe('A StatisticCollection Component', function () {
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="StatisticCollection"]');
  });

  describe('with Contextual data', function () {
    const buildFakeWindow = function (height, width) {
      return {
        innerHeight: height,
        innerWidth: width,
        addEventListener: function () {},
      };
    };

    it('should not add no-separator class when screen size narrow', () => {
      const winFake = buildFakeWindow(320, 320);
      const _statisticCollection = new StatisticCollection($elm, winFake);
      setTimeout(() => {
        const itemsWithNoSeparator = _statisticCollection.$elm.querySelectorAll('.no-separator');
        expect(itemsWithNoSeparator.length).to.equal(0);
      }, 0);
    });
  });
});
