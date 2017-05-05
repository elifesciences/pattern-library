'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class AssetViewer {

  constructor($elm, _window = window, doc = document) {
    this.$elm = $elm;
    this.window = _window;
    this.doc = doc;

    if (this.$elm.querySelector('.asset-viewer-inline__open_link')) {
      this.setup(doc);
    }
  }

  handleClick(e) {
    e.preventDefault();

    let figure = this.$elm.querySelector('.captioned-asset');
    let figureCaption = figure.querySelector('figcaption');
    let item = {};
    let type = this.$elm.dataset.variant;

    if (figureCaption) {
      item.title = figureCaption.innerHTML;
    }
    switch (type) {
      case 'figure':
      case 'supplement':
        let image = figure.querySelector('img');
        item.src = image.currentSrc;
        item.w = image.naturalWidth;
        item.h = image.naturalHeight;
        break;
      default:
        throw new TypeError(`Unknown type "${type}"`);
    }

    let items = [item];
    let options = {
      shareEl: false,
    };
    let gallery = new PhotoSwipe(document.querySelector('.pswp'), PhotoSwipeUI_Default, items, options);

    gallery.init();
  }

  setup(doc) {
    AssetViewer.load(doc).then(() => {
      this.$elm.querySelector('.captioned-asset__link').addEventListener('click', this.handleClick.bind(this));
      this.$elm.querySelector('.asset-viewer-inline__open_link').addEventListener('click', this.handleClick.bind(this));
    });
  }

  static load(doc) {
    if (!this.loader) {
      this.loader = Promise.all([
        utils.loadJavaScript('https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe.min.js', 'sha384-QELNnmcmU8IR9ZAykt67vGr9/rZJdHbiWi64V88fCPaOohUlHCqUD/unNN0BXSqy'),
        utils.loadJavaScript('https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe-ui-default.min.js', 'sha384-m67o7SkQ1ALzKZIFh4CiTA8tmadaujiTa9Vu+nqPSwDOqHrDmxLezTdFln8077+q'),
        utils.loadStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe.min.css', 'sha384-h/L2W9KefUClHWaty3SLE5F/qvc4djlyR4qY3NUV5HGQBBW7stbcfff1+I/vmsHh'),
        utils.loadStyleSheet('https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/default-skin/default-skin.min.css', 'sha384-iD0dNku6PYSIQLyfTOpB06F2KCZJAKLOThS5HRe8b3ibhdEQ6eKsFf/EeFxdOt5R'),
      ]);

      let div = document.createElement('div');
      div.className = 'pswp';
      div.tabIndex = '-1';
      div.setAttribute('role', 'dialog');
      div.setAttribute('aria-hidden', 'true');
      div.innerHTML = `
<div class="pswp__bg"></div>
<div class="pswp__scroll-wrap">
    <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
    </div>
    <div class="pswp__ui pswp__ui--hidden">
        <div class="pswp__top-bar">
            <div class="pswp__counter"></div>
            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
            <button class="pswp__button pswp__button--share" title="Share"></button>
            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
            <div class="pswp__preloader">
                <div class="pswp__preloader__icn">
                  <div class="pswp__preloader__cut">
                    <div class="pswp__preloader__donut"></div>
                  </div>
                </div>
            </div>
        </div>
        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div> 
        </div>
        <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
        <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
        <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
        </div>
    </div>
</div>
`;
      doc.body.appendChild(div);
    }

    return this.loader;

  }

};
