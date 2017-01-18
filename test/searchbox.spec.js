let expect = chai.expect;

// load in component(s) to be tested
let SearchBox = require('../assets/js/components/SearchBox');

describe('A SearchBox Component', function () {
  'use strict';
  let $elm;
  let searchBox;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="SearchBox"]');
    searchBox = new SearchBox($elm);

  });

  it('exists', function () {
    expect(searchBox).to.exist;
  });

  it('has the CSS class search-box--js', function () {
    expect($elm.classList.contains('search-box--js')).to.be.true;
  });

  it('contains a compact-form pattern', function () {
    expect(searchBox.$elm.querySelector('form')).to.be.an('HTMLFormElement');
  });

  it('possesses a handleInput() method', function() {
    expect(searchBox.handleInput).to.be.a('function')
  });

  describe('the handleInput() method', function () {
    let spy = sinon.spy;
    let eventMock;
    let searchBoxMock;

    beforeEach(() => {
      spy(searchBox, 'showResetButton');
      spy(searchBox, 'hideResetButton');

      eventMock = {
        preventDefault: spy(),
        target: 'I am current'
      };

    });

    afterEach(function () {
      searchBox.showResetButton.restore();
      searchBox.hideResetButton.restore();
    });

    it('does not do anything when the tab key is pressed', function () {
      eventMock.keyCode = 9;
      searchBox.handleInput(eventMock);
      expect(searchBox.showResetButton.called).to.be.false;
      expect(searchBox.hideResetButton.called).to.be.false;
    });

    it('shows the reset button if the input field is not empty', function () {
      searchBox.$input.value = 'I am not empty';
      searchBox.handleInput(eventMock);
      expect(searchBox.showResetButton.called).to.be.true;
      expect(searchBox.hideResetButton.called).to.be.false;
    });

    it('does not show the reset button if the input field is empty', function () {
      searchBox.$input.value = '';
      searchBox.handleInput(eventMock);
      expect(searchBox.showResetButton.called).to.be.false;
      expect(searchBox.hideResetButton.called).to.be.true;
    });

  });

});
