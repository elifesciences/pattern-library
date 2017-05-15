const utils = require('../libs/elife-utils')();

module.exports = class Popup {

  constructor($elm, _window = window, doc = document) {
    if (!$elm.hash) {
      return;
    }

    this.$elm = this.wrapInContainerWithClass($elm, 'span', 'popup');
    this.$link = this.$elm.querySelector('a');
    this.label = $elm.getAttribute('data-label') || '';
    this.isOpen = false;
    this.resolver = null;
    this.window = _window;
    this.doc = doc;
    this.bodyContents = null;
    this.hitBoxTranslation = 0;

    this.$link.addEventListener('click', e => this.handleLinkClick(e));

    doc.addEventListener('click', e => this.handleDocumentClick(e));
  }

  handleLinkClick(e) {
    e.preventDefault();

    this.isOpen = !this.isOpen;
    this.render();
  }

  handleDocumentClick(e) {

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

  }

  getResolver(link) {
    if (this.resolver) {
      return this.resolver;
    }

    // If there's no hash, there's no point in going on.
    if (!link.hash) {
      this.resolver = Promise.resolve(null);
      return this.resolver;
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
      this.resolver = Promise.resolve((id) => this.doc.querySelector(id));
      return this.resolver;
    }

    // This case will catch remote urls.
    this.resolver = utils.remoteQuerySelector(link.href);
    return this.resolver;
  }

  getBodyContentsFromNode(node) {
    if (!node) {
      return this.emptyResponse();
    }

    if (!node.getAttribute('data-popup-contents')) {

      // Mark empty.
      return this.emptyResponse();
    }

    if (node.getAttribute('data-popup-label')) {

      // Set label for jump link.
      this.label = node.getAttribute('data-popup-label');
    }

    if (node.getAttribute('data-popup-contents') === node.id) {

      // Return node if it points to itself.
      return node.cloneNode(true);
    }

    const target = node.getElementById(node.getAttribute('data-popup-contents'));
    if (!target) {

      // Also mark empty.
      return this.emptyResponse();
    }

    // Return the target.
    return target.cloneNode(true);
  }

  emptyResponse() {
    this.isEmpty = true;
    return null;
  }

  requestContents() {

    // We await on the contents, which might be XHR.
    return this.getResolver(this.$link).then(r => {

      // If there is contents the come back we add it to our object.
      if (r) {
        this.bodyContents = this.getBodyContentsFromNode(r(this.$link.hash));
        return this.render();

        // If not, we set this and ignore.
      } else {
        this.emptyResponse();
      }

      return Promise.resolve(this.$elm);
    });
  }

  createBottomBar(referenceLink) {
    const $bottomBar = utils.buildElement('div', ['popup__actions', 'clearfix']);

    const $seeInReferences = utils.buildElement('a', [
      'popup__button',
      'popup__button--right'
    ], this.label, $bottomBar);
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
    return utils.wrapElements(children, 'div', 'popup__window');
  }

  createPopupHitBox(...children) {
    return utils.wrapElements(children, 'div', 'popup__hit-box', {
      marginLeft: `${(this.$link.offsetWidth / 2)}px`,
    });
  }

  render() {
    // If there's nothing to render.. we don't.
    if (this.isEmpty) {
      return Promise.resolve(this.$elm);
    }

    // If there's no body to show, we request it.
    if (!this.bodyContents) {
      return this.requestContents();
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
          $bottomBar
        )
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

    return Promise.resolve(this.$elm);
  }
};
