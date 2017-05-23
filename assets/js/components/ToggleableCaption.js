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
          const firstWrappedNode = processedNodes.childNodes[1];
          $parent.replaceChild(processedNodes, childNode);
          this.wrapExcessCaption($parent, firstWrappedNode);
        }
      }
    });
  }

  // TODO: Change this so it puts the toggle at the end
  processTextNode(nextTextNode, thresholdCharCount) {
    if (this.accumulatedTextLength + nextTextNode.length < thresholdCharCount) {
      this.accumulatedTextLength += nextTextNode.length;
      return;
    }

    this.thresholdReached = true;
    const overBy = this.accumulatedTextLength + nextTextNode.length - thresholdCharCount;
    const splitNodes = this.splitTextNode(nextTextNode, nextTextNode.length - overBy);
    splitNodes.appendChild(this.buildCaptionToggle());
    return splitNodes;
  }

  wrapExcessCaption($parent, firstWrappedNode) {
    const $wrapper = utils.buildElement('div',
                                        [
                                          'visuallyhidden',
                                          'caption-text__body__collapsed_part'
                                        ]
    );

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
                                       'see more', $parent, $followingSibling);
    $toggle.addEventListener('click', this.toggleCaption.bind(this));
    return $toggle;
  }

  toggleCaption(e) {
    const $toggle = e.target;
    $toggle.parentNode.querySelector('.caption-text__body__collapsed_part').classList
           .toggle('visuallyhidden');
    const $toggleText = $toggle.innerHTML;
    const textWhenClosed = 'see more';
    const textWhenOpen = 'see less';
    $toggle.innerHTML =  $toggleText === textWhenClosed ? textWhenOpen : textWhenClosed;
  }

  isStopElement($element) {
    return this.window.getComputedStyle($element).display !== 'inline';
  }

};
