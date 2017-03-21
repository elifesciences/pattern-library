const utils = require('../libs/elife-utils')();

class ReferencePopup {

  constructor($elm, _window = window, doc = document) {
    const container = document.createElement('span');
    container.classList.add('reference-popup');
    container.innerHTML = $elm.outerHTML;
    $elm.parentNode.replaceChild(container, $elm);
    this.$elm = container;
    this.link = container.querySelector('a');
    this.linkWidth = this.link.offsetWidth;
    this.window = _window;
    this.doc = doc;
    this.bodyContents = null;
    this.$elm.addEventListener('mouseover', () => {
      this.hoverLink = true;
      this.render();
    });
    this.$elm.addEventListener('mouseout', () => {
      this.hoverLink = false;
      this.render();
    });
  }

  getResolver(link) {
    if (this.resolver) {
      return this.resolver;
    }

    // If there's no hash, there's no point in going on.
    if (!link.hash) {
      return this.resolver = Promise.resolve(null);
    }

    // This case will catch '#hashes' and '{currentUrl}#hashes'
    const current = this.window.location;
    if (
        link.href.substr(0, 1) === '#' || (
            link.hostname === current.hostname &&
            link.pathname === current.pathname
        )
    ) {
      return this.resolver = Promise.resolve((id) => this.doc.querySelector(id));
    }

    // This case will catch remote urls.
    return this.resolver = utils.remoteQuerySelector(link.href);
  }

  requestContents() {
    // We await on the contents, which might be XHR.
    this.getResolver(this.link).then(r => {

      // If there is contents the come back we add it to our object.
      if (r) {
        this.bodyContents = r(this.link.hash).cloneNode(true);
        this.render();

      // If not, we set this and ignore.
      } else {
        this.emptyBody = true;
      }
    });
  }

  createPopupBox(body) {
    const popup = document.createElement('div');
    popup.appendChild(body);
    popup.classList.add('reference-popup__window');
    return popup;
  }

  createPopupHitBox(...children) {
    const popupHitBox = document.createElement('div');
    popupHitBox.classList.add('reference-popup__hit-box');
    popupHitBox.style.marginLeft = `${(this.linkWidth /2)}px`;
    children.forEach(child => popupHitBox.appendChild(child));
    return popupHitBox;
  }

  createArrow() {
    const arrow = document.createElement('div');
    arrow.classList.add('reference-popup__arrow');
    return arrow;
  }

  render() {
    // If there's nothing to render.. we don't.
    if (this.emptyBody) {
      return null;
    }

    // If there's no body to show, we request it.
    if (!this.bodyContents) {
      this.requestContents();
      return null;
    }

    // If there's no popup element yet, we create it.
    if (!this.popupHitBox) {
      this.bodyContents.id = utils.uniqueIds.get('popupFragment', this.doc);

      // Create elements.
      this.popupHitBox = this.createPopupHitBox(
          this.createArrow(),
          this.createPopupBox(this.bodyContents)
      );

      // Add to DOM.
      this.$elm.appendChild(this.popupHitBox);
    }

    // Changing the state depending on the other properties of the object.
    if (this.hoverLink) {
      this.popupHitBox.classList.remove('reference-popup--hidden');
    } else {
      this.popupHitBox.classList.add('reference-popup--hidden');
    }

  }

}

module.exports = ReferencePopup;
