'use strict';

module.exports = class Pager {

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

  static normaliseData(data) {
    let dataNoLeadingWhitespace = data.replace(/^\s+([^\s])/gm, '$1');
    return dataNoLeadingWhitespace.replace(/\n/g, '');
  }

  injectNewData(newData) {
    let normalisedData = Pager.normaliseData(newData);
    let regex = /.*<ol[^>]*class="[^"]*(grid-listing|listing-list)[^"]*"[^>]*>(<li>?.*<\/li>)<\/ol>.*/;
    let match = normalisedData.match(regex);

    if (!(match && match[2])) {
      throw new SyntaxError('Loaded data doesn\'t match required format');
    }

    let data = match[2];
    let frag = this.doc.createDocumentFragment();
    let $temp = this.doc.createElement('div');
    $temp.innerHTML = data;
    // TODO: Consider intercepting here to determine if last page
    while ($temp.firstElementChild) {
      let child = $temp.firstElementChild;
      frag.appendChild(child);
    }

    this.$targetEl.appendChild(frag);
  }

  handleError (e) {
    let loaderLink = this.getValidLoaderLink();
    if (loaderLink) {
      this.window.location.search = loaderLink;
    }
  }

  getValidLoaderLink() {
    let match = this.$loader.href.match(/\?page=([0-9]+)/);
    if (match) {
      return match[0];
    }
  }

  getPageNumberFromLoaderLink() {
    let loaderLink = this.getValidLoaderLink();
    if (loaderLink) {
      let pageNumber = loaderLink.match(/\?page=([0-9]+)/)[1];
      return this.window.parseInt(pageNumber, 10);
    }
  }

  static isLastPage(data) {
    // TODO: Adjust if final implementation of pager next button changes
    return !data.match(/class="pager".*button--default.*button--default/g);
  }

  updatePager(data) {
    if (Pager.isLastPage(data)) {
      this.$loader.parentNode.removeChild(this.$loader);
    } else {
      let pageNumber = this.getPageNumberFromLoaderLink();
      if (!isNaN(pageNumber)) {
        pageNumber += 1;
        this.$loader.href = '?page=' + pageNumber;
      }
    }
  }

  updateUrl () {
    let validLoaderLink = this.getValidLoaderLink();
    if (validLoaderLink) {
      this.window.history.pushState(null, null, validLoaderLink);
    }
  }

  handleLoad(data) {
    let normalisedData;
    try {
      normalisedData = Pager.normaliseData(data);
      this.injectNewData(normalisedData);
    } catch (e) {
      this.handleError(e);
      return;
    }
    this.updateUrl();
    this.updatePager(normalisedData);
  }

  handleLoadRequest(e) {
    e.preventDefault();

    // TODO: Fix up this URL.
    // At the moment, this placeholder URL requires a local PHP server running in /test/fixtures.
    // this.loadNextPageData('//localhost:9090/pagerData.php', this.window.XMLHttpRequest)

    let pageNum = this.getPageNumberFromLoaderLink();

    // DEBUG:
    // let pageNum = this.getPageNumberFromLoaderLink() - 1;
    // this.loadNextPageData('//localhost:9090/pagerData_' + pageNum + '.php', this.window.XMLHttpRequest)

    this.loadNextPageData('?page=' + pageNum, this.window.XMLHttpRequest)
        .then(this.handleLoad.bind(this), this.handleError.bind(this));
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
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
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
