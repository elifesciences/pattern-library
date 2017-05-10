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

    let items = [];
    let index = 0;

    const assets = this.findAssets();
    [].forEach.call(assets, (asset, i) => {
      const caption = asset.querySelector('.caption-text__heading');
      const image = asset.querySelector('img');

      let item = {
        src: image.currentSrc,
        w: image.naturalWidth,
        h: image.naturalHeight,
      };

      if (caption) {
        item.title = caption.innerHTML;
      }

      items.push(item);

      if (asset.id === this.$elm.id) {
        index = i;
      }
    });

    const options = {
      index: index,
      history: false,
      shareEl: false,
    };

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    const gallery = new PhotoSwipe(document.querySelector('.pswp'), PhotoSwipeUI_Default, items, options); // jshint ignore:line

    // jscs:enable

    gallery.init();

    gallery.listen('beforeChange', () => {
      const asset = this.findAssets()[gallery.getCurrentIndex()];
      const event = utils.eventCreator('assetViewerFocus');

      asset.dispatchEvent(event);
    });
  }

  findAssets() {
    return this.doc.querySelectorAll(`[data-asset-viewer-group="${this.$elm.dataset.assetViewerGroup}"]`);
  }

  setup(doc) {
    AssetViewer.load(doc).then(() => {
      const assetLink = this.$elm.querySelector('.captioned-asset__link');
      const openLink = this.$elm.querySelector('.asset-viewer-inline__open_link');

      if (assetLink) {
        assetLink.addEventListener('click', this.handleClick.bind(this));
      }

      if (openLink) {
        openLink.addEventListener('click', this.handleClick.bind(this));
      }
    });
  }

  static load(doc) {
    if (!this.loader) {
      this.loader = Promise.all([
        utils.loadJavaScript(
          'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe.min.js',
          'sha384-QELNnmcmU8IR9ZAykt67vGr9/rZJdHbiWi64V88fCPaOohUlHCqUD/unNN0BXSqy'
        ),
        utils.loadJavaScript(
          'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe-ui-default.min.js',
          'sha384-m67o7SkQ1ALzKZIFh4CiTA8tmadaujiTa9Vu+nqPSwDOqHrDmxLezTdFln8077+q'
        ),
        utils.loadStyleSheet(
          'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/photoswipe.min.css',
          'sha384-h/L2W9KefUClHWaty3SLE5F/qvc4djlyR4qY3NUV5HGQBBW7stbcfff1+I/vmsHh'
        ),
        utils.loadStyleSheet(
          'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.2/default-skin/default-skin.min.css',
          'sha384-iD0dNku6PYSIQLyfTOpB06F2KCZJAKLOThS5HRe8b3ibhdEQ6eKsFf/EeFxdOt5R'
        ),
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
