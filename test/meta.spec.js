'use strict';

const expect = chai.expect;
const spy = sinon.spy;

// load in component(s) to be tested
let Meta = require('../assets/js/components/Meta');

describe('A Meta Component', function () {
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="Meta"]');
  });

  describe('with data', function () {
    const buildFakeWindow = function (height, width) {
      return {
        innerHeight: height,
        innerWidth: width,
        addEventListener: function () {},
      };
    };

    it('should not add no-separator class when screen size narrow', () => {
      const winFake = buildFakeWindow(320, 320);
      const _meta = new Meta($elm, winFake);
      const itemsWithNoSeparator = _meta.$elm.querySelectorAll('.no-separator');
      expect(itemsWithNoSeparator.length).to.equal(0);
    });
  });
});
