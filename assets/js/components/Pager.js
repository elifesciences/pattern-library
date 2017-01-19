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
    this.loaderLink = this.$loader.getAttribute('href');
    this.$loader.addEventListener('click', this.handleLoadRequest.bind(this));
  }

  static normaliseData(data) {
    let dataNoLeadingWhitespace = data.replace(/^\s+([^\s])/gm, '$1');
    return dataNoLeadingWhitespace.replace(/\n/g, '');
  }

  createDocFragFromString(str) {
    if (typeof str !== 'string') {
      return;
    }

    let frag = this.doc.createDocumentFragment();
    let $temp = this.doc.createElement('div');
    $temp.innerHTML = str;
    while ($temp.firstElementChild) {
      let child = $temp.firstElementChild;
      frag.appendChild(child);
    }

    return frag;
  }

  injectNewData(newData) {
    let normalisedData = Pager.normaliseData(newData);
    this.setLoaderLinkFromData(normalisedData);
    let regex =
      /.*<ol[^>]*class="[^"]*(grid-listing|listing-list)[^"]*"[^>]*>(<li>?.*<\/li>)<\/ol>.*/;
    let match = normalisedData.match(regex);

    if (!(match && match[2])) {
      throw new SyntaxError('Loaded data doesn\'t match required format');
    }

    this.$targetEl.appendChild(this.createDocFragFromString(match[2]));
  }

  redirectToFullResultsPage() {
    let loaderLink = this.getLoaderLink();
    if (loaderLink) {
      this.window.location.search = loaderLink;
    }
  }

  handleError () {
    this.redirectToFullResultsPage();
  }

  getLoaderLink() {
    return this.loaderLink;
  }

  /**
   * Sets the link for the next page onto the $loader, if it can find it in the supplied data
   *
   * @param normalisedData HTML as string with leading space and line breaks removed
   *
   */
  setLoaderLinkFromData(normalisedData) {
    let regex = /.*(<div[^>]*class="[^"]*pager[^"]*"[^>]*>.*<\/div>).*/;
    let $docFragOfPagerFoundInData = this.createDocFragFromString(normalisedData.match(regex)[1]);
    if (!$docFragOfPagerFoundInData) {
      this.loaderLink = '#';
      return;
    }

    let nextPageButton = $docFragOfPagerFoundInData.querySelector('.button:nth-child(2)');
    if (!nextPageButton) {
      this.loaderLink = '#';
      return;
    }

    let nextPageButtonLink = nextPageButton.href;
    let location = this.window.location;
    this.loaderLink = nextPageButtonLink.replace(location.protocol + '//' + location.host, '');
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
                                                              : 'Load more';
    }

    this.$loader.classList.remove('button--inactive');
  }

  updatePager(normalisedData) {
    if (Pager.isLastPage(normalisedData)) {
      this.$loader.parentNode.removeChild(this.$loader);
    } else {
      this.setLoaderLinkFromData(normalisedData);
    }
  }

  updateUrl () {
    let loaderLink = this.getLoaderLink();
    if (loaderLink) {
      this.window.history.pushState(null, '', loaderLink);
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
      return null;
    }

    this.loadData(this.getLoaderLink(), this.window.XMLHttpRequest)
        .then(this.handleLoad.bind(this), this.handleError.bind(this));
    this.setLoadingState();
  }

  loadData(url, XMLHttpRequest) {

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
