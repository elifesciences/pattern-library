'use strict';

const utils = require('../libs/elife-utils')();

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

    this.isCurrentlyLoading = false;
    this.timeoutThresholdInMs = 10000;
    this.$loader.addEventListener('click', this.handleLoadRequest.bind(this));
  }

  static normaliseData(data) {
    let dataNoLeadingWhitespace = data.replace(/^\s+([^\s])/gm, '$1');
    return dataNoLeadingWhitespace.replace(/\n/g, '');
  }

  injectNewData(newData) {
    let normalisedData = Pager.normaliseData(newData);
    let regex =
      /.*<ol[^>]*class="[^"]*(grid-listing|listing-list)[^"]*"[^>]*>(<li>?.*<\/li>)<\/ol>.*/;
    let match = normalisedData.match(regex);

    if (!(match && match[2])) {
      throw new SyntaxError('Loaded data doesn\'t match required format');
    }

    let data = match[2];
    let frag = this.doc.createDocumentFragment();
    let $temp = this.doc.createElement('div');
    $temp.innerHTML = data;
    while ($temp.firstElementChild) {
      let child = $temp.firstElementChild;
      frag.appendChild(child);
    }

    this.$targetEl.appendChild(frag);
  }

  redirectToFullResultsPage() {
    let loaderLink = this.getValidLoaderLink();
    if (loaderLink) {
      this.window.location.search = loaderLink;
    }
  }

  handleError () {
    this.redirectToFullResultsPage();
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
    return !data.match(/class="pager".*button--default.*button--default/g);
  }

  setLoadingState () {
    this.isCurrentlyLoading = true;
    this.$loader.classList.add('button--inactive');
    let $pagerTextWrapper = this.$loader.querySelector('.pager__text_wrapper');
    if ($pagerTextWrapper) {
      $pagerTextWrapper.innerHTML = 'Loading...';
      $pagerTextWrapper.classList.add('loading');
    }

    // If the loading takes longer than timeoutThresholdInMs, try to go to the full results page.
    this.loadingTimer = this.window.setTimeout(() => {
      this.redirectToFullResultsPage();
    }, this.timeoutThresholdInMs);
  }

  clearLoadingState () {
    this.window.clearTimeout(this.loadingTimer);
    this.isCurrentlyLoading = false;
    let $pagerTextWrapper = this.$loader.querySelector('.pager__text_wrapper');
    if ($pagerTextWrapper) {
      $pagerTextWrapper.classList.remove('loading');
      $pagerTextWrapper.innerHTML = !!this.$loader.originalText ? this.$loader.originalText
                                                              : 'More articles';
    }

    this.$loader.classList.remove('button--inactive');
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
      this.window.history.pushState(null, '', validLoaderLink);
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

    this.clearLoadingState();
    this.updateUrl();
    this.updatePager(normalisedData);
  }

  handleLoadRequest(e) {
    e.preventDefault();

    if (this.isCurrentlyLoading) {
      return;
    }

    let pageNum = this.getPageNumberFromLoaderLink();
    this.loadNextPageData('?page=' + pageNum, this.window.XMLHttpRequest)
        .then(this.handleLoad.bind(this), this.handleError.bind(this));
    this.setLoadingState();
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
    if (!$loader) {
      return;
    }

    $loader.id = utils.uniqueIds.get('pager', this.doc);
    $loader.originalText = $loader.innerHTML;
    let $loaderTextWrapper = this.doc.createElement('span');
    $loaderTextWrapper.classList.add('pager__text_wrapper');
    $loaderTextWrapper.innerHTML = $loader.originalText;
    $loader.replaceChild($loaderTextWrapper, $loader.firstChild);

    return $loader;
  }

  find$targetEl() {
    return this.doc.querySelector('#' + this.$elm.dataset.targetid);
  }

};
