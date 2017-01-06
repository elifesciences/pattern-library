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

    this.$targetEl.appendChild(frag);
  }

  error (e) {
    this.window.console.log(e);
  }

  handleUrlChange () {
    let newQueryString = this.$loader.href.match(/\?page=([0-9]+)/);
    if (Array.isArray(newQueryString)) {
      this.window.history.pushState(null, null, newQueryString[0]);
      let pageNumber = this.window.parseInt(newQueryString[1], 10) + 1;
      this.$loader.href = '?page=' + pageNumber;
    }
  }

  handleLoadRequest(e) {
    e.preventDefault();

    // TODO: Fix up this URL.
    // At the moment, this placeholder URL requires a local PHP server running in /test/fixtures.
    let loadData = this.loadNextPageData('//localhost:9090/pagerData.php',
                                         this.window.XMLHttpRequest);
    loadData.then(this.injectNewData.bind(this), this.error.bind(this));
    loadData.then(this.handleUrlChange.bind(this), this.error.bind(this));
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
