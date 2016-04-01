
// temp array for keywords and authors
let keywords = ['keywords', 'authors'];

module.exports = class SearchBox {

  constructor($elm) {
    if (!$elm) {
      console.warn('No element provided');
      return;
    } else {
      console.log('Initialising SearchBox...');
    }

    this.$container = $elm.querySelector('fieldset');
    this.$form = $elm.querySelector('form');
    this.$input = $elm.querySelector('input[type="search"]');
    this.$limit = $elm.querySelector('input[type="checkbox"]');

    // check there's even a search input field for us to use,
    // otherwise everything else is pointless.
    // console warn outta here so that errors don't prevent other scripts from running.
    if (!this.$input) {
      console.warn('Could not find an input for the SearchBox');
      return;
    }

    this.matchesFound = [];
    this.searchLimited = this.$limit && this.$limit.checked;

    // setup
    this.$form.setAttribute('autocomplete', 'off');

    this.$output = document.createElement('div');
    this.$output.classList.add('search-box__output');
    this.$output.style.top = window.getComputedStyle(this.$input).height;
    this.$container.appendChild(this.$output);

    // events
    this.$input.addEventListener('keyup', this.filter.bind(this));
  }

  /**
    filter()
  */
  filter(e) {
    e.preventDefault();

    console.log('filtering keywords...');

    let entry = this.$input.value;

    this.matchesFound = [];

    if (entry != '') {

      // filter the list
      this.matchesFound = keywords.filter(keyword => keyword.indexOf(entry) != -1);

      // sort the final list alphabetically
      this.matchesFound.sort();

      // bold the relevant characters of the word
      for (var i = 0; i < this.matchesFound.length; i++) {
        this.matchesFound[i] = this.bolden(this.matchesFound[i], entry);
      }

      // can we do all the above in one fell swoop? (probably)
    }

    this.display();
  }

  /**
    bolden()
  */
  bolden(word, snippet) {
    return word.replace(snippet, `<strong>${snippet}</strong>`);
  }

  /**
    display()
  */
  display() {
    let outputString = '';

    if (this.matchesFound.length) {
      this.matchesFound.forEach(v => {
        outputString += `<li>${v}</li>`;
      });

      outputString = `<ul>${outputString}</ul>`;
      this.$output.innerHTML = outputString;
    } else {
      this.$output.innerHTML = '';
    }
  }

};
