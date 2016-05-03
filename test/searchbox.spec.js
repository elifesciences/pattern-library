let expect = chai.expect;

// load in component(s) to be tested
let SearchBox = require('../assets/js/components/SearchBox');

describe('A SearchBox Component', function () {
  'use strict';
  let $elm;
  let searchBox;
  let eventMock;
  let searchBoxMock;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="SearchBox"]');
    searchBox = new SearchBox($elm);

    eventMock = {
      preventDefault: sinon.spy(),
      filter: sinon.spy(),
      target: 'I am current'
    };

    searchBoxMock = {
      nextSuggestion: sinon.spy(),
      prevSuggestion: sinon.spy(),
      useSuggestion: sinon.spy(),
      filterKeywordsBySearchTerm: sinon.spy(),
      showResetButton: sinon.spy(),
      hideResetButton: sinon.spy(),

      display: sinon.spy(),
      $input: {
        value: ''
      },
      $output: {
        innerHTML: null
      }
    };

  });

  afterEach(function () {
    $elm = null;
    searchBox = null;
    eventMock = null;
    searchBoxMock = null;

  });

  it('exists', function () {
    expect(searchBox).to.exist;
  });

  it('has the CSS class search-box--js', function () {
    expect($elm.classList.contains('search-box--js')).to.be.true;
  });

  it('contains a compact-form pattern', function () {
    expect(searchBox.$form).to.be.an('HTMLFormElement');
  });

  it('possesses an embolden() static method', function () {
    expect(SearchBox.embolden).to.be.a('function');
  });

  it('possesses a handleKeyEntry() static method', function() {
    expect(SearchBox.handleKeyEntry).to.be.a('function')
  });


  it('possesses a setKeywords() static method', function () {
    expect(SearchBox.setKeywords).to.be.a('function');
  });

  it('possesses a filterKeywordsBySearchTerm() method', function() {
    expect(searchBox.filterKeywordsBySearchTerm).to.be.a('function')
  });

  it('possesses a display() method', function() {
    expect(searchBox.display).to.be.a('function')
  });

  it('possesses a nudgeOutputVertically() method', function() {
    expect(searchBox.nudgeOutputVertically).to.be.a('function')
  });

  describe('its optional search limiter', function() {

    let limiter;

    beforeEach(function () {
      limiter = searchBox.$limit;
    });

    afterEach(function () {
      limiter = null;
    });

    it('if present, is deactivated by default', function() {
      if (!limiter) {
        return;
      }
      expect(searchBox.isSearchLimited).to.be.false;
    });

    it('when activated, limits the search', function () {
      if (!limiter) {
        return;
      }
      searchBox.isSearchLimited = false;
      searchBox.toggleSearchLimiting();
      expect(searchBox.isSearchLimited).to.be.true;
    });

  });

  describe('the embolden() method', function () {

    it('emboldens the expected text', function () {
      let phrase = 'Just the next three words I am bold should be bold.';
      let snippetToEmbolden = 'I am bold';
      let correctResponse = 'Just the next three words <strong>I am bold</strong> should be bold.';
      expect(SearchBox.embolden(phrase, snippetToEmbolden)).to.equal(correctResponse);
    });

    it('ignores the case of the text specfified to be emboldened', function () {
      let phrase = 'Just the next three words I am bold should be bold.';
      let snippetToEmbolden = 'I AM BOLD';
      let correctResponse = 'Just the next three words <strong>I am bold</strong> should be bold.';
      expect(SearchBox.embolden(phrase, snippetToEmbolden)).to.equal(correctResponse);
    });

  });

  describe('the handleKeyEntry() method', function () {

    it('does not do anything when the tab key is pressed', function () {
      eventMock.keyCode = 9;
      SearchBox.handleKeyEntry(eventMock, searchBoxMock);
      expect(searchBoxMock.nextSuggestion.called).to.be.false;
      expect(searchBoxMock.prevSuggestion.called).to.be.false;
      expect(searchBoxMock.useSuggestion.called).to.be.false;
      expect(searchBoxMock.filterKeywordsBySearchTerm.called).to.be.false;
      expect(searchBoxMock.showResetButton.called).to.be.false;
      expect(searchBoxMock.hideResetButton.called).to.be.false;
    });

    it('calls (only) for previous suggestion when up arrow pressed', function () {
      eventMock.keyCode = 38;
      SearchBox.handleKeyEntry(eventMock, searchBoxMock);
      expect(searchBoxMock.nextSuggestion.called).to.be.false;
      expect(searchBoxMock.prevSuggestion.calledWith(eventMock.target)).to.be.true;
      expect(searchBoxMock.useSuggestion.called).to.be.false;
      expect(searchBoxMock.filterKeywordsBySearchTerm.called).to.be.false;
      expect(searchBoxMock.showResetButton.called).to.be.false;
      expect(searchBoxMock.hideResetButton.called).to.be.false;
    });

    it('calls (only) for next suggestion when down arrow pressed', function () {
      eventMock.keyCode = 40;
      SearchBox.handleKeyEntry(eventMock, searchBoxMock);
      expect(searchBoxMock.nextSuggestion.calledWith(eventMock.target)).to.be.true;
      expect(searchBoxMock.prevSuggestion.called).to.be.false;
      expect(searchBoxMock.useSuggestion.called).to.be.false;
      expect(searchBoxMock.filterKeywordsBySearchTerm.called).to.be.false;
      expect(searchBoxMock.showResetButton.called).to.be.false;
      expect(searchBoxMock.hideResetButton.called).to.be.false;
    });

    it('uses (only) the current suggestion when the return key is pressed', function () {
      eventMock.keyCode = 13;
      SearchBox.handleKeyEntry(eventMock, searchBoxMock);
      expect(searchBoxMock.nextSuggestion.called).to.be.false;
      expect(searchBoxMock.prevSuggestion.called).to.be.false;
      expect(searchBoxMock.useSuggestion.calledWith(eventMock.target)).to.be.true;
      expect(searchBoxMock.filterKeywordsBySearchTerm.called).to.be.false;
      expect(searchBoxMock.showResetButton.called).to.be.false;
      expect(searchBoxMock.hideResetButton.called).to.be.false;
    });

    describe('when a different key is pressed', function () {

      it('invokes the search filter', function () {
        let keyStrokes = ['q', 'e', 'g', 'k', '3', 'M'];
        let dummyKeywords = ['These', 'are', 'dummy', 'keywords'];
        let sampleSearchTerm = 'sample search term';
        searchBoxMock.$input.value = sampleSearchTerm;

        keyStrokes.forEach(keyStroke => {
          eventMock.keyCode = keyStroke.charCodeAt(0);
          SearchBox.setKeywords(dummyKeywords, searchBoxMock);
          SearchBox.handleKeyEntry(eventMock, searchBoxMock);
          expect(searchBoxMock.nextSuggestion.called).to.be.false;
          expect(searchBoxMock.prevSuggestion.called).to.be.false;
          expect(searchBoxMock.useSuggestion.called).to.be.false;
          expect(searchBoxMock.filterKeywordsBySearchTerm
                              .calledWith(dummyKeywords, sampleSearchTerm)).to.be.true;
        });
      });

      it('calls to show the reset button if the search input is not empty', function () {
        searchBoxMock.$input.value = 'a non-empty value';

        // Value of keyCode not important, but it should have one. This one is for 'A'.
        eventMock.keyCode = 65;
        SearchBox.handleKeyEntry(eventMock, searchBoxMock);
        expect(searchBoxMock.showResetButton.called).to.be.true;
        expect(searchBoxMock.hideResetButton.called).to.be.false;
      });

      it('calls to hide the reset button if the search input is empty', function () {

        // Empty
        searchBoxMock.$input.value = '';

        // Value of keyCode not important, but it should have one. This one is for 'A'.
        eventMock.keyCode = 65;
        SearchBox.handleKeyEntry(eventMock, searchBoxMock);
        expect(searchBoxMock.showResetButton.called).to.be.false;
        expect(searchBoxMock.hideResetButton.called).to.be.true;
      });

    });

  });

  describe('the filterKeywordsBySearchTerm() method', function () {

    let fakeKeywords;

    beforeEach(function () {
      fakeKeywords = [
        'xHere',
        'xAre',
        'xSome',
        'yFake',
        'yKeywords'
      ];
    });

    it('returns matching keywords in alphabetical order', function () {
      var observed = searchBox.filterKeywordsBySearchTerm(fakeKeywords, 'x');

      // Remove any emboldening, this test doesn't care about that.
      observed = observed.map(function(item) {
        return item.replace(/<\/?strong>/g, '');
      });
      expect(observed.length).to.equal(3);
      expect(observed.indexOf('xAre')).to.equal(0);
      expect(observed.indexOf('xHere')).to.equal(1);
      expect(observed.indexOf('xSome')).to.equal(2);
      expect(observed.indexOf('yFake')).to.equal(-1);
      expect(observed.indexOf('yKeywords')).to.equal(-1);
    });

  });

  describe('the display() method', function () {

    it('doesn\'t do anything if there are no matches to display', function () {
      searchBox.display([], searchBoxMock.$output);
      expect(searchBoxMock.$output.innerHTML).to.equal('');
    });

    it('holds any matches as in an unordered list', function() {

      let inOut = {
        'cell biology': '<li tabindex="0" class="search-box__suggestion">cell biology</li>',
        'cell signalling': '<li tabindex="0" class="search-box__suggestion">cell signalling</li>',
        'cellular differentiation': '<li tabindex="0" class="search-box__suggestion">cellular differentiation</li>',
        'cellular growth': '<li tabindex="0" class="search-box__suggestion">cellular growth</li>'
      };

      let matches = Object.keys(inOut);
      searchBox.display(matches, searchBoxMock.$output);
      let output = searchBoxMock.$output.innerHTML;
      matches.forEach(match => {
        expect(output.indexOf(inOut[match])).to.be.above(-1);
      });
      expect(output.indexOf('<ul')).to.equal(0);
      expect(output.indexOf('</ul>')).to.equal(output.length - 5);
    });

  });

  describe('the setKeywords() method', function () {

    it('a searchBox\'s keywords are set by providing them to this method', function () {
      let keywords = ['here', 'are', 'some', 'dummy', 'keywords'];
      SearchBox.setKeywords(keywords, searchBox);
      expect(searchBox.keywords).to.equal(keywords);
    })

  });

});
