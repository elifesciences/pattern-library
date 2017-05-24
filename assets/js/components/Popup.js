const utils = require('../libs/elife-utils')();

module.exports = class Popup {

  constructor($elm, _window = window, doc = document) {
    if (!$elm.hash || $elm.host !== _window.location.host || !$elm.hash.match(/^#[a-z]/i)) {
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
    if (!this.$link) {
      return true;
    }

    e.preventDefault();

    this.isOpen = !this.isOpen;
    this.render(e).then(() => {
      if (this.isEmpty) {
        const link = this.$link;
        this.$link = null;
        link.click();
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

  createPopupBox(...children) {
    // Get the content
    let $content;
    [].forEach.call(children, (child) => {
      if (child.classList.contains('popup__content')) {
        $content = child;
      }
    });

    // wrap ancillary content in an ancillary block
    if ($content instanceof HTMLElement) {
      const $ancillary = utils.buildElement('div', ['popup__content__ancillary']);
      const exclusions = ['reference__title', 'reference__authors_list',
                          'reference__authors_list_suffix', 'author-details__name'];
      const ancillaries = [];

      // If an immediate child of content does not have an excluded class, it's ancillary
      // Ancillary elements are added to a new ancillary block
      [].forEach.call($content.children, ($contentChild) => {
        let isAncillary = false;
        [].forEach.call($contentChild.classList, (cssClass) => {
          if (!isAncillary && exclusions.indexOf(cssClass) === -1) {
            ancillaries.push($contentChild);
            isAncillary = true;
          }
        });
      });

      ancillaries.forEach(($ancillaryChild) => {
        $ancillary.appendChild($ancillaryChild);
      });

      $content.appendChild($ancillary);
    }

    return utils.wrapElements(children, 'div', 'popup__window');

  }

  createPopupHitBox(...children) {
    return utils.wrapElements(children, 'div', 'popup__hit-box');
  }

  positionPopupHitBox(e) {
    this.popupHitBox.style.display = '';

    const width = this.popupHitBox.offsetWidth;
    const height = this.popupHitBox.offsetHeight;

    let left = e.pageX - (width / 2);
    let top = e.pageY + 20;

    // If off the left.
    if (left < 10) {
      left = 10;
    }

    // If off the right.
    if ((left + width + 10) > this.window.innerWidth) {
      left = this.window.innerWidth - width - 10;
    }

    // See if can be placed completely above.
    const topIfAbove = e.pageY - height - 20;
    if (top + height + 10 > (this.window.pageYOffset + this.window.innerHeight) && topIfAbove >= (this.window.pageYOffset + 10)) {
      top = topIfAbove;
    }

    this.popupHitBox.style.left = `${left}px`;
    this.popupHitBox.style.top = `${top}px`;
  }

  render(e) {
    // If there's nothing to render.. we don't.
    if (this.isEmpty) {
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

    // Changing the state depending on the other properties of the object.
    if (this.isOpen) {
      this.positionPopupHitBox(e);
    } else {
      this.popupHitBox.style.display = 'none';
    }

    return Promise.resolve(this.$link);
  }
};
