const expect = chai.expect;

const AnnotationTeaser = require('../assets/js/components/AnnotationTeaser');
const fixtureHTML = document.querySelector('[data-behaviour="AnnotationTeaser"]').innerHTML;

function resetFixture(fixtureHTML) {
  'use strict';

  const allFixtures = document.querySelectorAll('[data-behaviour="AnnotationTeaser"]');
  [].forEach.call(allFixtures, (fixture, i) => {
    if (i === 0) {
      fixture.innerHTML = fixtureHTML;
    } else {
      fixture.parentNode.removeChild(fixture);
    }
  });
}

function setIsReply(status) {
  'use strict';

  const $root = document.querySelector('[data-behaviour="AnnotationTeaser"]');
  if (status) {
    $root.dataset.isReply = "1";
  } else {
    delete $root.dataset.isReply;
  }
}

describe('An AnnotationTeaser Component', function () {
  'use strict';

  beforeEach(() => {
    resetFixture(fixtureHTML);
  });

  describe('the anchor element it creates', () => {

    it('wraps everything inside the component\'s root element', () => {
      const $expectedAnchor = new AnnotationTeaser(document.querySelector('[data-behaviour="AnnotationTeaser"]')).$elm.firstElementChild;
      expect($expectedAnchor.nodeName).to.equal('A');
    });

    it('has an href corresponding to the component\'s inContextUri data attribute', () => {
      const expectedHref = 'http://example.com';
      const $root = document.querySelector('[data-behaviour="AnnotationTeaser"]');
      $root.dataset.inContextUri = expectedHref;

      const $anchor = new AnnotationTeaser($root).$elm.firstElementChild;
      expect($anchor.getAttribute('href')).to.equal(expectedHref);
    });

  });


  context('when it is a reply', () => {

    it('has the text "View the full conversation"', () => {
      setIsReply(true);
      const $annotationTeaser = new AnnotationTeaser(document.querySelector('[data-behaviour="AnnotationTeaser"]'));
      expect($annotationTeaser.$elm.innerHTML).to.have.string('View the full conversation');
    })

  });

  context('when it is not a reply', () => {

    it('does not have the text "View the full conversation"', () => {
      setIsReply(false);
      const $annotationTeaser = new AnnotationTeaser(document.querySelector('[data-behaviour="AnnotationTeaser"]'));
      expect($annotationTeaser.$elm.innerHTML).not.to.have.string('View the full conversation');
    })

  });

});
