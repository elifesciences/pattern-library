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

      let item = {
        src: asset.dataset.assetViewerUri,
        w: asset.dataset.assetViewerWidth,
        h: asset.dataset.assetViewerHeight,
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
          'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.3/photoswipe.min.js',
          'sha384-jkeJ/ETDRD/P4Y3I3CQi1QIwrEJjR9GdAZV2/aqDwwgA5ldCNiExYJeBwKyQC/+q'
        ),
        utils.loadJavaScript(
          'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.3/photoswipe-ui-default.min.js',
          'sha384-HotcxRWS6/oszHPwknjGnd066fV8+ycnO5TXDcOscFWvTtaiCtEEv+9s5Qrn1iJD'
        ),
        utils.loadStyleSheet(
          'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.3/photoswipe.min.css',
          'sha384-yX+tSqQp3yF8BiTuLLOwNyaqtmZ9yFQT7IYg7U9YU9Dz/JDlh6JJQmNClCmvYl+b'
        ),
        utils.loadStyleSheet(
          'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.3/default-skin/default-skin.min.css',
          'sha384-R6P/wJIrxjHcm//YCjb0S6rRgebsNn3u6U4NxVI8R03iSPAR5CwPqoq1n6U/tjFE'
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
