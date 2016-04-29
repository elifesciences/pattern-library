'use strict';

module.exports = class SearchBox {

  // Passing window and document separately allows for independent mocking of window in order
  // to test feature support fallbacks etc.
  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$container = $elm.querySelector('fieldset');
    this.$form = $elm.querySelector('form');
    this.$input = $elm.querySelector('input[type="search"]');
    this.$limit = $elm.querySelector('input[type="checkbox"]');
    this.$elm = $elm;
    this.$searchButton = $elm.querySelector('button[type="submit"]');
    this.$resetButton = $elm.querySelector('button[type="reset"]');

    // Check there's a search input field, if not everything else is pointless.
    if (!this.$input) {
      return;
    }

    // TODO: Remove if not ultimately useful.
    this.isSearchLimited = this.$limit && this.$limit.checked;

    this.$elm.classList.add('search-box--js');

    // setup
    this.$form.setAttribute('autocomplete', 'off');

    if (!doc.querySelector('.search-box__output')) {
      this.$output = doc.createElement('div');
      this.$output.innerHTML = '';
      this.$output.classList.add('search-box__output');
      this.$output.addEventListener('keyup', e => {
        SearchBox.handleKeyEntry(e, this);
      });
      this.$output.addEventListener('click', e => {
        this.useSuggestion(e.target);
      });
      this.$elm.appendChild(this.$output);
    }

    this.keywords = [];

    // events
    this.$resetButton.addEventListener('click', this.reset.bind(this));
    this.$input.addEventListener('keyup', e => {
      SearchBox.handleKeyEntry(e, this);
    });
    this.$input.addEventListener('paste', this.showResetButton.bind(this));

    // TODO: Remove this test data when decided how to populate this list of keywords with real data
    SearchBox.setKeywords([
                            'Xiao-Dong Li', 'Zhijian J Chen', 'Cell biology',
                           'Immunology', 'bacteria',
                          ], this);
  }

  /**
   * Handles the reset button being pressed.
   */
  reset() {
    this.hideResetButton();
    if (this.$output) {
      this.$output.innerHTML = '';
    }

    this.$input.focus();
  }

  /**
   * Hides the reset button.
   */
  hideResetButton() {
    this.$elm.classList.remove('search-box--populated');
  }

  /**
   * Shows the reset button.
   */
  showResetButton() {
    this.$elm.classList.add('search-box--populated');
  }

  /**
   * Responds to the keyCode of a KeyboardEvent (used on the input field and suggestions).
   *
   * Takes care not to trap the tab character. Accessibility!
   * Down arrow (keyCode 40): go to the next suggestion.
   * Up arrow (keyCode 38): go to the previous suggestion.
   * Return (keyCode 13): put the text of the current suggestion into the search box
   * Any other key: use it to filter keywords; also show/hide reset button.
   *
   * @param {KeyboardEvent} e The event to respond to
   * @param {SearchBox} searchBox Calling object (injected to make method more testable)
   */
  static handleKeyEntry(e, searchBox) {
    let current = e.target;
    if (e.keyCode && e.keyCode !== 9) {
      switch (e.keyCode) {
      case 40:
        searchBox.nextSuggestion(current);
        break;
      case 38:
        searchBox.prevSuggestion(current);
        break;
      case 13:
        searchBox.useSuggestion(current);
        break;
      default:
        searchBox.display(searchBox.filterKeywordsBySearchTerm(SearchBox.getKeywords(searchBox),
                                                       searchBox.$input.value), searchBox.$output);
        if (searchBox.$input.value.length > 0) {
          searchBox.showResetButton();
        } else {
          searchBox.hideResetButton();
        }

        break;
      }
    }
  }

  /**
   * Selects the search suggestion element after the current one.
   *
   * If already on the last one, loop to the beginning and select the input field.
   *
   * @param {HTMLElement} current The search suggestion or input field currently with focus
   */
  nextSuggestion(current) {
    if (!this.$output) {
      return;
    }

    if (current === this.$input) {
      this.$output.querySelector('ul li:first-child').focus();
    } else if (!!current.nextElementSibling) {
      current.nextElementSibling.focus();
    } else {
      this.$input.focus();
    }
  }

  /**
   * Selects the search suggestion element before the current one.
   *
   * If already on the input field, loop to the end and select the last one.
   *
   * @param {HTMLElement} current The search suggestion or input field currently with focus
   */
  prevSuggestion(current) {
    if (!this.$output) {
      return;
    }

    if (current === this.$input) {
      this.$output.querySelector('ul li:last-child').focus();
    } else if (!!current.previousElementSibling) {
      current.previousElementSibling.focus();
    } else {
      this.$input.focus();
    }
  }

  /**
   * Copy the display text of the current suggestion into the search field.
   *
   * @param {HTMLElement} target The element containing the text to use
   */
  useSuggestion(target) {
    this.$input.value = target.innerHTML.replace(/<\/?strong>/g, '');
    if (this.$output) {
      this.$output.innerHTML = '';
      if (this.$input.value.length) {
        this.$form.submit();
      }
    }
  }

  /**
   * Gets the keywords for the supplied searchBox.
   *
   * @param {SearchBox} searchBox The injected search box
   */
  static getKeywords(searchBox) {
    return searchBox.keywords;
  }

  /**
   * Sets the keywords for the supplied searchBox.
   *
   * @param {Array} keywords The keywords for the searchBox
   * @param {SearchBox} searchBox The injected search box
   */
  static setKeywords(keywords, searchBox) {
    searchBox.keywords = keywords;
  }

  /**
   * Filter keywords by the contents of the search field.
   *
   * @param {string} searchTerm The search term to filter the keywords by
   * @param {Array} keywords The keywords to filter
   */
  filterKeywordsBySearchTerm(keywords, searchTerm) {
    let matches;
    if (searchTerm) {
      matches = keywords.filter(keyword => keyword.toLowerCase().indexOf(
                                                                  searchTerm.toLowerCase()) !== -1);

      matches.sort();
      for (let i = 0; i < matches.length; i += 1) {
        matches[i] = SearchBox.embolden(matches[i], searchTerm);
      }
    }

    return matches;
  }

  /**
   * Returns phrase with specified (case insensitive) snippet emboldened.
   *
   * @param {string} phrase The phrase containing the text to embolden
   * @param {string} snippet The substring of phrase to embolden
   * @returns {string} The phrase with the snippet emboldened
   */
  static embolden(phrase, snippet) {
    // Don't nest emboldening elements.
    if (snippet.indexOf('<strong>') > -1) {
      return phrase;
    }

    let snippetRx = new RegExp(snippet, 'i');
    let toEmbolden = phrase.match(snippetRx) ? phrase.match(snippetRx)[0] : null;
    if (!toEmbolden) {
      return phrase;
    }

    return phrase.replace(toEmbolden, `<strong>${toEmbolden}</strong>`);
  }

  /**
   * Update the search suggestions based on matches found.
   *
   * @param {Array} matches The matches found
   * @param {HTMLElement} $output Element to contain the display
   */
  display(matches, $output) {
    let outputString = '';

    if ($output) {
      $output.innerHTML = '';

      if (matches && matches.length) {
        matches.forEach(match => {
          outputString += `<li tabindex="0">${match}</li>`;
        });

        outputString = `<ul>${outputString}</ul>`;
        $output.innerHTML = outputString;
      }
    }
  }

  /**
   * Sets the top position of the output block
   *
   * @param posnInPx The top position expressed in pixels
   */
  setOutputTopPosn(posnInPx) {
    this.$output.style.top = posnInPx;
  }

  /**
   * Toggle the flag that limits the search.
   */
  toggleSearchLimiting() {
    this.isSearchLimited = !this.isSearchLimited;
  }

};
