'use strict';
const utils = require('../libs/elife-utils')();

module.exports = class ToggleableCaption {

  constructor($elm, _window = window, doc = document) {
    this.window = _window;
    this.doc = doc;

    this.$elm = $elm;
    if (!($elm instanceof HTMLElement)) {
      return;
    }

    this.$caption = ToggleableCaption.findCaption(this.$elm);
    if (!(this.$caption instanceof HTMLElement)) {
      return;
    }

    this.thresholdTextLength = 200;
    this.accumulatedTextLength = 0;
    this.processedMoreThanFirstElement = false;
    this.isToggleBuilt = false;
    this.thresholdReached = false;
    this.setupToggle(this.$caption, this.thresholdTextLength);

  }

  static findCaption($elm) {
    return $elm.querySelector('.caption-text__body');
  }

  setupToggle($caption, thresholdCharCount) {
    this.processElement($caption, thresholdCharCount);
  }

  processElement($element, thresholdCharCount) {
    if (this.thresholdReached) {
      return;
    }

    const childNodes = $element.childNodes;
    [].forEach.call(childNodes, (childNode) => {
      if (this.isToggleBuilt) {
        return;
      }

      if (childNode.nodeType === Node.ELEMENT_NODE) {
        if (this.isStopElement(childNode)) {
          if (this.processedMoreThanFirstElement) {
            this.buildCaptionToggle(childNode.parentNode, childNode);
            this.isToggleBuilt = true;
          } else {
            this.processedMoreThanFirstElement = true;
            this.processElement(childNode, thresholdCharCount);
          }
        } else {
          this.processElement(childNode, thresholdCharCount);
        }
      } else if (childNode.nodeType === Node.TEXT_NODE) {
        const processedNodes = this.processTextNode(childNode, thresholdCharCount);
        if (processedNodes) {
          const $parent = childNode.parentNode;
          const firstWrappedNode = processedNodes.lastChild;
          $parent.replaceChild(processedNodes, childNode);
          this.wrapExcessCaption($parent, firstWrappedNode);
        }
      }
    });
  }

  processTextNode(nextTextNode, thresholdCharCount) {
    if (this.accumulatedTextLength + nextTextNode.length < thresholdCharCount) {
      this.accumulatedTextLength += nextTextNode.length;
      return;
    }

    this.thresholdReached = true;
    const overBy = this.accumulatedTextLength + nextTextNode.length - thresholdCharCount;
    const splitNodes = this.splitTextNode(nextTextNode, nextTextNode.length - overBy);
    const $toggle = this.buildCaptionToggle();
    splitNodes.insertBefore($toggle, splitNodes.childNodes[1]);
    return splitNodes;
  }

  wrapExcessCaption($parent, firstWrappedNode) {
    const $wrapper = utils.buildElement('div',
                                        [
                                          'visuallyhidden',
                                          'caption-text__body__collapsed_part'
                                        ]
    );
    $wrapper.style.display = 'inline';
    $wrapper.style.margin = '0';
    $parent.insertBefore($wrapper, firstWrappedNode);
    const nodesToWrap = this.doc.createDocumentFragment();
    nodesToWrap.appendChild(firstWrappedNode);
    let nextNodeToWrap = firstWrappedNode.nextSibling;
    while (nextNodeToWrap && nextNodeToWrap.nextSibling) {
      nodesToWrap.appendChild(firstWrappedNode.nextSibling);
      nextNodeToWrap = nextNodeToWrap.nextSibling;
    }

    $wrapper.appendChild(nodesToWrap);
  }

  splitTextNode(textNode, splitIndex) {
    const frag = this.doc.createDocumentFragment();
    frag.appendChild(this.doc.createTextNode(textNode.nodeValue.substring(0, splitIndex)));
    frag.appendChild(this.doc.createTextNode(textNode.nodeValue.substring(splitIndex)));
    return frag;
  }

  buildCaptionToggle($parent, $followingSibling) {
    const $toggle = utils.buildElement('button', ['caption-text__toggle'],
                                       'TOGGLE', $parent, $followingSibling);
    $toggle.addEventListener('click', this.toggleCaption.bind(this));
    return $toggle;
  }

  toggleCaption(e) {
    e.target.nextElementSibling.classList.toggle('visuallyhidden');
  }

  isStopElement($element) {
    return this.window.getComputedStyle($element).display !== 'inline';
  }

};
