const utils = require('../libs/elife-utils')();

module.exports = class Popup {

  constructor($elm, _window = window, doc = document) {
    let $link;

    if ($elm.dataset.popupWrapper) {
      $link = utils.buildElement('a');
      $link.classList.add('popup__wrapper');
      $link.href = '#';
      $elm.parentNode.insertBefore($link, $elm);
      $link.appendChild($elm);
    } else {
      $link = $elm;
    }

    if (!$elm.dataset.popupSelf) {
      if (!$link.hash || $link.host !== _window.location.host || !$link.hash.match(/^#[a-z]/i)) {
        return;
      }
    }

    this.$link = $link;
    this.$elm = $elm;
    this.isOpen = false;
    this.resolver = null;
    this.window = _window;
    this.doc = doc;
    this.bodyContents = null;
    this.thresholdWidth = 730;
    this.$link.addEventListener('click', e => this.handleLinkClick(e));

    doc.addEventListener('click', e => this.handleDocumentClick(e));
  }

  handleLinkClick(e) {
    // If the viewport is too narrow, we don't.
    if (!this.window.matchMedia(`(min-width: ${this.thresholdWidth}px)`).matches) {
      if (e.currentTarget.href.match(/.*#$/)) {
        e.stopPropagation();
        e.preventDefault();
      }

      return;
    }

    // Stops popup if link is in a table
    if (utils.closest(this.$link, 'table')) {
      return;
    }

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

    // If the viewport is too narrow, we don't.
    if (!this.window.matchMedia(`(min-width: ${this.thresholdWidth}px)`).matches) {
      return;
    }

    if (utils.closest(e.target, 'a') === this.$link) {
      return;
    }

    const closestPopup = utils.closest(e.target, '.popup');
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
    if (this.$elm.dataset.popupSelf) {
      this.bodyContents = this.$elm.cloneNode(true);
      return Promise.resolve(this.render(e));
    }

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

  createBottomBar(label, link) {
    const $bottomBar = utils.buildElement('div', ['popup__actions', 'clearfix']);

    const $seeInReferences = utils.buildElement('a', [
      'popup__button',
      'popup__button--right'
    ], label, $bottomBar);
    $seeInReferences.href = link;

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
                          'reference__authors_list_suffix', 'author-details__name',
                          'about-profile__name', 'about-profile__role'];
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
    return utils.wrapElements(children, 'div', 'popup');
  }

  calcInitialPosition(e, width) {
    // Triggered by a pointer
    if (e.pageX || e.pageY) {
      return {
        left: e.pageX - (width / 2),
        top: e.pageY + 20
      };
    }

    // Triggered by keyboard
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      left: rect.left + this.window.scrollX,
      top: (rect.bottom - /*three baseline grid measures*/72) +  this.window.scrollY
    };
  }

  setAccessibilityAttributesPopupHitBox(isToBeShown) {
    if (isToBeShown) {
      this.popupHitBox.setAttribute('role', 'alert');
      this.popupHitBox.setAttribute('aria-expanded', 'true');
      this.popupHitBox.setAttribute('aria-hidden', 'false');
      this.popupHitBox.blur();
    } else {
      this.popupHitBox.setAttribute('aria-expanded', 'false');
      this.popupHitBox.setAttribute('aria-hidden', 'true');
      this.popupHitBox.style.display = 'none';
    }
  }

  setAttributesForOpenPopupHitBox(e) {
    this.setAccessibilityAttributesPopupHitBox(true, e);
  }

  setAttributesForClosedPopupHitBox() {
    this.setAccessibilityAttributesPopupHitBox(false);
  }

  positionPopupHitBox(e) {
    this.popupHitBox.style.display = '';

    const width = this.popupHitBox.offsetWidth;
    const height = this.popupHitBox.offsetHeight;

    const initialPosition = this.calcInitialPosition(e, width);
    let left = initialPosition.left;
    let top = initialPosition.top;

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

    this.$link.parentNode.insertBefore(this.popupHitBox, this.$link.nextElementSibling);
    this.popupHitBox.style.left = `${left}px`;
    this.popupHitBox.style.top = `${top}px`;
    this.setAttributesForOpenPopupHitBox(e);
  }

  static setLinksClasses($root) {
    if ($root instanceof HTMLElement) {
      [].slice.call($root.querySelectorAll('a')).forEach($link => {
        $link.classList.add('popup__link');
      });
    }
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

      let children = [this.bodyContents];
      if (this.label) {
        children.push(this.createBottomBar(this.label, this.$link.href));
      }

      // Create elements.
      this.popupHitBox = this.createPopupHitBox(
        this.createPopupBox(...children)
      );

      Popup.setLinksClasses(this.popupHitBox);

      // Add to DOM.
      this.doc.body.appendChild(this.popupHitBox);

      this.window.addEventListener('resize', utils.debounce(() => {
        // If the viewport is too narrow, we don't.
        if (!this.window.matchMedia(`(min-width: ${this.thresholdWidth}px)`).matches) {
          return;
        }

        this.isOpen = false;
        this.render(e);
      }, 150));
    }

    // Changing the state depending on the other properties of the object.
    if (this.isOpen) {
      this.positionPopupHitBox(e);

      this.popupHitBox.addEventListener('blur', () => {
        this.setAttributesForClosedPopupHitBox();
        this.isOpen = false;
        this.$link.focus();
      });

    } else {
      this.popupHitBox.style.display = 'none';
      this.setAttributesForClosedPopupHitBox();
      this.$link.focus();
    }

    return Promise.resolve(this.$link);
  }
};
