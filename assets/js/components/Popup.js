const utils = require('../libs/elife-utils')();

module.exports = class Popup {

  constructor($elm, _window = window, doc = document) {
    if (!$elm.hash) return;
    this.$elm = this.wrapInContainerWithClass($elm, 'span', 'popup');
    this.$link = this.$elm.querySelector('a');
    this.label = $elm.getAttribute('data-label') || 'See in references';
    this.isOpen = false;
    this.resolver = null;
    this.window = _window;
    this.doc = doc;
    this.bodyContents = null;
    this.hitBoxTranslation = 0;

    this.$link.addEventListener('click', e => {
      e.preventDefault();

      this.isOpen = !this.isOpen;
      this.render();
    });

    doc.addEventListener('click', e => {
      if (utils.closest(e.target, '.popup__hit-box') === this.popupHitBox) {
        return;
      }
      const closestPopup = utils.closest(e.target, '.popup');
      if (closestPopup && closestPopup === this.$elm) {
        return;
      }
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
        link.href.indexOf('#') === 0 || (
        link.hostname === current.hostname &&
        link.port === current.port &&
        link.protocol === current.protocol &&
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
        this.isEmpty = true;
      }
    });
  }

  createBottomBar(referenceLink) {
    const $bottomBar = utils.buildElement('div', ['popup__actions', 'clearfix']);

    const $seeInReferences = utils.buildElement('a', ['popup__button', 'popup__button--right'], this.label, $bottomBar);
    $seeInReferences.href = referenceLink;

    return $bottomBar;
  }

  wrapInContainerWithClass($elm, tag, className) {
    const $container = utils.buildElement(tag, [className]);
    $container.innerHTML = $elm.outerHTML;
    $elm.parentNode.replaceChild($container, $elm);
    return $container;
  }

  createPopupBox(...children) {
    const popup = utils.buildElement('div', ['popup__window']);
    children.forEach(child => popup.appendChild(child));
    return popup;
  }

  createPopupHitBox(...children) {
    const popupHitBox = utils.buildElement('div', ['popup__hit-box']);
    popupHitBox.style.marginLeft = `${(this.$link.offsetWidth / 2)}px`;
    children.forEach(child => popupHitBox.appendChild(child));
    return popupHitBox;
  }

  render() {
    // If there's nothing to render.. we don't.
    if (this.isEmpty) {
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
      this.bodyContents.classList.add('popup__content');

      const $bottomBar = this.createBottomBar(this.$link.href);

      // Create elements.
      this.popupHitBox = this.createPopupHitBox(
        this.createPopupBox(
          this.bodyContents,
          $bottomBar,
        ),
      );

      // Add to DOM.
      this.$elm.appendChild(this.popupHitBox);
    }

    // Change between above and below link.
    if (this.isOpen) {
      this.$elm.classList.add('popup--above');
      this.$elm.classList.remove('popup--below');
      const hitBox = this.popupHitBox.getBoundingClientRect();
      if (hitBox.top < 0) {
        this.$elm.classList.remove('popup--above');
        this.$elm.classList.add('popup--below');
      }

      // Check some cheap access variables.
      if (hitBox.right > window.innerWidth || hitBox.left < 0 || hitBox.right > window.innerWidth) {

        // Catches when the popup is wider than the window. (has to re-render.)
        if (this.popupHitBox.style.width > 0 && this.popupHitBox.style.width < window.innerWidth) {
          this.popupHitBox.style.width = `${window.innerWidth - 40}px`; // 40px is padding.
          return this.render(); // After this point, we have enough room to fit the popup.
        }

        // If we are too far left, translate right by the difference.
        if (hitBox.left < 0) {
          this.hitBoxTranslation -= hitBox.left;
          this.popupHitBox.style.transform = `translateX(${this.hitBoxTranslation}px)`;
        }

        // If we are too far right, translate left by the difference.
        if (hitBox.right > window.innerWidth) {
          this.hitBoxTranslation += hitBox.right - window.innerWidth;
          this.popupHitBox.style.transform = `translateX(-${this.hitBoxTranslation}px)`;
        }
      }
    }

    // Changing the state depending on the other properties of the object.
    if (this.isOpen) {
      this.$elm.classList.remove('popup--hidden');
    } else {
      this.$elm.classList.add('popup--hidden');
    }
  }
};
