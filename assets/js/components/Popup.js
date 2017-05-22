const utils = require('../libs/elife-utils')();

module.exports = class Popup {

  constructor($elm, _window = window, doc = document) {
    if (!$elm.hash || $elm.host !== _window.location.host) {
      return;
    }

    this.$link = $elm;
    this.isOpen = false;
    this.resolver = null;
    this.window = _window;
    this.doc = doc;
    this.bodyContents = null;

    this.$link.addEventListener('click', e => this.handleLinkClick(e));

    doc.addEventListener('click', e => this.handleDocumentClick(e));
  }

  handleLinkClick(e) {
    e.preventDefault();

    this.isOpen = !this.isOpen;
    this.render(e).then(() => {
      if (this.isEmpty) {
        window.location = e.target.href;
      }
    });
  }

  handleDocumentClick(e) {

    if (utils.closest(e.target, 'a') === this.$link) {
      return;
    }

    const closestPopup = utils.closest(e.target, '.popup__hit-box');
    if (closestPopup && closestPopup === this.popupHitBox) {
      return;
    }

    if (this.isOpen) {
      this.isOpen = false;
      this.render(e);
    }

  }

  getResolver(link) {
    if (this.resolver) {
      return this.resolver;
    }

    // If there's no hash, there's no point in going on.
    if (!link.hash) {
      this.resolver = Promise.resolve(null);
    } else {
      this.resolver = utils.remoteDoc(link.href, this.window);
    }

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

  requestContents(e) {

    // We await on the contents, which might be XHR.
    return this.getResolver(this.$link).then(r => {

      // If there is contents the come back we add it to our object.
      if (r) {
        this.bodyContents = this.getBodyContentsFromNode(r.querySelector(this.$link.hash));
        return this.render(e);

        // If not, we set this and ignore.
      } else {
        this.emptyResponse();
      }

      return Promise.resolve(this.$link);
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
    return utils.wrapElements(children, 'div', 'popup__hit-box');
  }

  positionPopupHitBox(e) {
    let left = e.pageX - 170;
    let top = e.pageY + 20;

    if (left < 10) {
      left = 10;
    }

    if ((left + 340 + 10) > this.window.innerWidth) {
      left = this.window.innerWidth - 340 - 10;
    }

    this.popupHitBox.style.left = `${left}px`;
    this.popupHitBox.style.top = `${top}px`;
  }

  render(e) {
    // If there's nothing to render.. we don't.
    if (this.isEmpty) {
      utils.jumpToAnchor(this.$link);
      return Promise.resolve(this.$link);
    }

    // If there's no body to show, we request it.
    if (!this.bodyContents) {
      return this.requestContents(e);
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
      this.doc.body.appendChild(this.popupHitBox);

      this.window.addEventListener('resize', utils.debounce(() => {
        this.isOpen = false;
        this.render(e);
      }, 150));
    }

    // Change between above and below link.
    if (this.isOpen) {
      this.positionPopupHitBox(e);
    }

    // Changing the state depending on the other properties of the object.
    if (this.isOpen) {
      this.popupHitBox.style.display = '';
    } else {
      this.popupHitBox.style.display = 'none';
    }

    return Promise.resolve(this.$link);
  }
};
