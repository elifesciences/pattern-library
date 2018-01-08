const expect = chai.expect;
const spy = sinon.spy;

const AnnotationTeaser = require('../assets/js/components/AnnotationTeaser');

// TODO: load fixture dynamically before each test otherwise DOM mutation creates problems between tests

function setIsReply(status) {
  const $root = document.querySelector('[data-behaviour="AnnotationTeaser"]');
  if (status) {
    $root.dataset.isReply = "1";
  } else {
    delete $root.dataset.isReply;
  }
}

describe('An AnnotationTeaser Component', function () {
  'use strict';


  describe('the anchor element it creates', () => {

    let $annotationTeaser;
    let $expectedAnchor;

    beforeEach(() => {
      $annotationTeaser = new AnnotationTeaser(document.querySelector('[data-behaviour="AnnotationTeaser"]'));
      $expectedAnchor = $annotationTeaser.$elm.firstElementChild;
    });

    it('wraps everything inside the component\'s root element', () => {
      expect($expectedAnchor.nodeName).to.equal('A');
    });

    it('has an href corresponding to the component\'s inContextUri data attribute', () => {
      expect($expectedAnchor.getAttribute('href')).to.equal('uriTestValue');
    });

  });


  context('when it is a reply', () => {

    let $annotationTeaser;

    before(() => {
      setIsReply(true);
      $annotationTeaser = new AnnotationTeaser(document.querySelector('[data-behaviour="AnnotationTeaser"]'));
    });

    it('has the text "View the full conversation"', () => {
      expect($annotationTeaser.$elm.innerHTML).to.have.string('View the full conversation');
    })

  });

  context('when it is not a reply', () => {

    let $annotationTeaser;

    before(() => {
      setIsReply(false);
      $annotationTeaser = new AnnotationTeaser(document.querySelector('[data-behaviour="AnnotationTeaser"]'));
    });

    it('does not have the text "View the full conversation"', () => {
      expect($annotationTeaser.$elm.innerHTML).not.to.have.string('View the full conversation');
    })

  });

});
