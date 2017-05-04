let expect = chai.expect;

// load in component(s) to be tested
let SideBySideView = require('../assets/js/components/SideBySideView');

describe('A SideBySideView Component', function () {
  'use strict';
  let $elm;

  beforeEach(function () {
    $elm = document.querySelector('.global-inner');
  });


    let sideBySideView;

    beforeEach(function () {
      sideBySideView = new SideBySideView($elm, 'http://lens.elifesciences.org/19749/index.html');
    });

    it('opens an iframe', function() {
      sideBySideView.openSideBySideView();
      expect(sideBySideView.$sideBySideView.classList.contains('hidden')).to.be.false;
      expect(sideBySideView.$sideBySideView.getAttribute('src')).to.equal('http://lens.elifesciences.org/19749/index.html');
      expect(sideBySideView.$sideBySideCloseButton.classList.contains('hidden')).to.be.false;
      expect(document.querySelector('[role="main"]').classList.contains('hidden')).to.be.true;

    });

    it('closes the iframe', function() {
      sideBySideView.openSideBySideView();
      sideBySideView.closeSideBySideView();
      expect(sideBySideView.$sideBySideView.classList.contains('hidden')).to.be.true;
      expect(sideBySideView.$sideBySideCloseButton.classList.contains('hidden')).to.be.true;
      // TODO: extract let sampleMainContent
      expect(document.querySelector('[role="main"]').classList.contains('hidden')).to.be.false;
    });

    it('comes back to the last known scrolling position when closing the side-by-side view', function() {
      window.scroll(0, 100);
      sideBySideView.openSideBySideView();
      expect(sideBySideView.window.pageYOffset).to.equal(0);
      sideBySideView.closeSideBySideView();
      expect(sideBySideView.window.pageYOffset).to.equal(100);
    });

});
