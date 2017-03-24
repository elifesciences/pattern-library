const utils = require('../libs/elife-utils')();

class ReferencePopup {

  constructor($elm, _window = window, doc = document) {
    if (!$elm.hash) return;
    this.$elm = this.wrapInContainerWithClass($elm, 'span', 'reference-popup');
    this.$link = this.$elm.querySelector('a');
    this.isOpen = false;
    this.resolver = null;
    this.window = _window;
    this.doc = doc;
    this.bodyContents = null;

    this.$link.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();

      this.isOpen = !this.isOpen;
      this.render();
    });

    doc.addEventListener('click', () => {
      if (this.isOpen) {
        this.isOpen = false;
        this.render();
      }
    })
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
    this.getResolver(this.$link).then(r => {

      // If there is contents the come back we add it to our object.
      if (r) {
        this.bodyContents = r(this.$link.hash).cloneNode(true);
        this.render();

        // If not, we set this and ignore.
      } else {
        this.emptyBody = true;
      }
    });
  }

  createBottomBar(referenceLink) {
    const $bottomBar = document.createElement('div');
    $bottomBar.classList.add('reference-popup__actions');
    $bottomBar.classList.add('clearfix');

    const $seeInReferences = document.createElement('a');
    $seeInReferences.href = referenceLink;
    $seeInReferences.innerText = "See in references";
    $seeInReferences.classList.add('reference-popup__button');
    $seeInReferences.classList.add('reference-popup__button--right');

    $bottomBar.appendChild($seeInReferences);

    return $bottomBar;
  }

  wrapInContainerWithClass($elm, tag, className) {
    const $container = document.createElement(tag);
    $container.classList.add(className);
    $container.innerHTML = $elm.outerHTML;
    $elm.parentNode.replaceChild($container, $elm);
    return $container;
  }

  createPopupBox(...children) {
    const popup = document.createElement('div');
    children.forEach(child => popup.appendChild(child));
    popup.classList.add('reference-popup__window');
    return popup;
  }

  createPopupHitBox(...children) {
    const popupHitBox = document.createElement('div');
    popupHitBox.classList.add('reference-popup__hit-box');
    popupHitBox.style.marginLeft = `${(this.$link.offsetWidth / 2)}px`;
    children.forEach(child => popupHitBox.appendChild(child));
    return popupHitBox;
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
      this.bodyContents.classList.add('reference-popup__content');

      const $bottomBar = this.createBottomBar(this.$link.href);

      // Create elements.
      this.popupHitBox = this.createPopupHitBox(
          this.createPopupBox(
              this.bodyContents,
              $bottomBar
          ),
      );

      // Add to DOM.
      this.$elm.appendChild(this.popupHitBox);
    }

    // Change between above and below link.
    if (this.isOpen) {
      this.$elm.classList.add('reference-popup--above');
      this.$elm.classList.remove('reference-popup--below');
      const hitBox = this.popupHitBox.getBoundingClientRect();
      if (hitBox.top < 0) {
        this.$elm.classList.remove('reference-popup--above');
        this.$elm.classList.add('reference-popup--below');
      }
    }

    // Changing the state depending on the other properties of the object.
    if (this.isOpen) {
      this.$elm.classList.remove('reference-popup--hidden');
    } else {
      this.$elm.classList.add('reference-popup--hidden');
    }
  }
}

module.exports = ReferencePopup;
