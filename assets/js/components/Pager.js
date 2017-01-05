'use strict';

module.exports = class SearchBox {

  constructor($elm, _window = window, doc = document) {
    if (!$elm) {
      return;
    }

    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    this.$targetEl = this.find$targetEl();
    this.$loader = this.find$Loader();
    if (!(this.$loader && this.$targetEl)) {
      return;
    }
    this.currentPage = 1;
    this.$loader.addEventListener('click', this.handleLoadRequest.bind(this));
  }

  injectNewData(newData) {
    let $data = newData.match(/<li>?.*<\/li>/)[0];
    let frag = this.doc.createDocumentFragment();
    let $temp = this.doc.createElement('div');
    $temp.innerHTML = $data;
    while ($temp.firstElementChild) {
      let child = $temp.firstElementChild;
      frag.appendChild(child);
    }

    // Is this fragment identifier necessary? Decide when worked out URL handling.
    frag.firstElementChild.id = 'page' + this.currentPage;
    this.$targetEl.appendChild(frag);
  }

  success (data) {
    this.currentPage += 1;
    this.injectNewData(data);
    // TODO: Update the URL
    // TODO: Decide on url handling
  }

  error (e) {
    this.window.console.log(e);
  }

  // send a request to get the data [tick]
  // insert the data [tick]
  // add a fragment id [tick]
  // update the URL

  handleLoadRequest(e) {
    e.preventDefault();
    // TODO: Fix up this URL.
    // At the moment, this placeholder URL requires a local PHP server running in /test/fixtures.
    this.loadNextPageData('//localhost:9090/pagerData.php', this.window.XMLHttpRequest)
        .then(this.success.bind(this), this.error.bind(this));
  }

  loadNextPageData(url, XMLHttpRequest) {

    return new Promise(
      function resolver(resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.addEventListener('load', () => {
          resolve(xhr.responseText);
        });
        xhr.addEventListener('error', reject);
        xhr.open('GET', url);
        xhr.send();
      }
    );

  }

  find$Loader() {
    let $loader = this.$elm.querySelector('.button--full:first-child.button--full:last-child');
    let rand = Math.round(Math.random() * 10e7);
    $loader.id = 'loader' + rand;
    return $loader;
  }

  find$targetEl() {
    return this.doc.querySelector('#' + this.$elm.dataset.targetid);
  }

};
