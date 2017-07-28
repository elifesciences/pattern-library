"use strict";

let expect = chai.expect;
let spy = sinon.spy;
let elifeUtils = require('../assets/js/libs/elife-utils')();

describe('The eLife utils library', function () {

  it('exists', function () {
    expect(elifeUtils).to.exist;
  });

  describe('adjustPxString method', function () {

    it('can add a numerical value to a px string, returning adjusted value as a px string',
    function () {
      let operation = 'add';
      expect(elifeUtils.adjustPxString('200px', 3, operation)).to.equal('203px');
      expect(elifeUtils.adjustPxString('200px', -3, operation)).to.equal('197px');
      expect(elifeUtils.adjustPxString('-1px', 500, operation)).to.equal('499px');
      expect(elifeUtils.adjustPxString('-1000px', 200, operation)).to.equal('-800px');
    });

    it('can subtract a numerical value from a px string, returning adjusted value as a px string',
    function () {
      let operation = 'subtract';
      expect(elifeUtils.adjustPxString('203px', 3, operation)).to.equal('200px');
      expect(elifeUtils.adjustPxString('500px', -1, operation)).to.equal('501px');
      expect(elifeUtils.adjustPxString('-500px', -20, operation)).to.equal('-480px');
      expect(elifeUtils.adjustPxString('-1000px', -200, operation)).to.equal('-800px');
     });

    it('can multiply a numerical value from a px string, returning adjusted value as a px string',
    function () {
      let operation = 'multiply';
      expect(elifeUtils.adjustPxString('203px', -3, operation)).to.equal('-609px');
      expect(elifeUtils.adjustPxString('-100px', 3, operation)).to.equal('-300px');
      expect(elifeUtils.adjustPxString('-100px', -2, operation)).to.equal('200px');
      expect(elifeUtils.adjustPxString('300px', 4, operation)).to.equal('1200px');
     });

    it('can divdie a numerical value from a px string, returning adjusted value as a px string',
    function () {
      let operation = 'divide';
      expect(elifeUtils.adjustPxString('300px', -3, operation)).to.equal('-100px');
      expect(elifeUtils.adjustPxString('-100px', 4, operation)).to.equal('-25px');
      expect(elifeUtils.adjustPxString('-100px', -2, operation)).to.equal('50px');
      expect(elifeUtils.adjustPxString('300px', 3, operation)).to.equal('100px');
     });

    it('can add a numerical value to a "0" string, returning adjusted value as a px string',
    function () {
      expect(elifeUtils.adjustPxString('0', 25, 'add')).to.equal('25px');
    });

    it('can subtract a numerical numerical value from a "0" string, returning adjusted value as a px string',
    function () {
      expect(elifeUtils.adjustPxString('0', 25, 'subtract')).to.equal('-25px');
    });

    it('can add a numerical value to a px string, returning a "0" string correctly',
    function () {
      expect(elifeUtils.adjustPxString('-100px', 100, 'add')).to.equal('0');
    });

    it('can subtract a numerical value from a px string, returning a "0" string correctly',
    function () {
      expect(elifeUtils.adjustPxString('100px', -100, 'add')).to.equal('0');
    });

  });

  describe('invertPxString method', function () {

    it('can mathematically invert a positive px value', function () {
      expect(elifeUtils.invertPxString('100px')).to.equal('-100px');
    });

    it('can mathematically invert a negative px value', function () {
      expect(elifeUtils.invertPxString('-100px')).to.equal('100px');
    });

    it('doesn\'t change a "0" string', function () {
      expect(elifeUtils.invertPxString('0')).to.equal('0');
    });

  });

  describe('uniqueIds object', function () {
    let uIds;

    beforeEach(function () {
      uIds = elifeUtils.uniqueIds;
    });

    it('keeps track of assigned unique ids', function () {
      expect(uIds.used).to.have.length(0);
      expect(uIds.used.indexOf(uIds.get())).to.equal(0);
      expect(uIds.used).to.have.length(1);
    });

    describe('get method', function () {

      it('always returns a string with the specified prefix', function () {
        let expectedPrefix = 'prefix';
        for (let i = 0; i < 10; i +=1) {
          expect(uIds.get(expectedPrefix).indexOf(expectedPrefix)).to.equal(0);
        }
      });

    });

    describe('isValid method', function () {

      it('returns false if a pre-existing value is attempted to be duplicated', function () {
        uIds.used = ['usedValue'];
        expect(uIds.isValid('usedValue')).to.be.false;
      });

      it('returns false if a component-unique value already exists in the document', function () {
        let idInDoc = 'alreadyInTheDoc';
        let docMock = {
          querySelector: function (selector) {
            return selector === '#' + idInDoc;
          }
        };
        uIds.used = [];
        expect(uIds.isValid(idInDoc, docMock)).to.be.false;

      });

      it('returns true for a component-unique value when no document is supplied', function () {
        uIds.used = [];
        expect(uIds.isValid('uniqueId')).to.be.true;
      });

      it('returns true for a value that is unique in both the component and the supplied document',
      function () {
        let docMock = {
          querySelector: function () {
            return null;
          }
        };
        uIds.used = [];
        expect(uIds.isValid('uniqueId', docMock)).to.be.true;
      });

    });

  });

  describe('updateElementTranslate method', function () {

    let updtElTrans = elifeUtils.updateElementTranslate;

    it('returns false if not passed an HTMLElement', function () {
      expect(updtElTrans({}, [0, 0])).to.be.false;
    });

    it('returns false if not passed an array', function () {
      expect(updtElTrans(document.createElement('div'), 'not-an-array')).to.be.false;
    });

    it('does not return false if passed an HTMLElement and an array', function () {
      expect(updtElTrans(document.createElement('div'), [0, 0])).not.to.be.false;
    });

    describe('when it does not return false', function () {

      let properties;

      beforeEach(function () {
        // Test will probably run under headless webkit, but allow for other user agents
        properties = [
          'webkitTransform',
          'mozTransform',
          'msTransform',
          'oTransform',
          'transform'
        ];


      });

      it('the expected property values are set on the HTMLElement when supplied as numbers',
      function() {
        let deltas = [
          [15, 15], [15, -15], [-15, 15], [15, 0], [0, 15], [-15, 0], [0, -15], [0], [15], [-15]
        ];

        deltas.forEach(function (delta) {
          let deltaX = delta[0] + 'px';
          let deltaY = delta[1] ? delta[1] + 'px' : '0px';

          let $el = document.createElement('div');
          updtElTrans($el, delta);
          properties.forEach(function (property) {
            if ($el.style[property] !== undefined) {
              expect($el.style[property]).to.equal('translate(' + deltaX + ', ' + deltaY + ')');
            }
          });

        });

      });

      it('the expected property values are set on the HTMLElement when supplied as strings',
         function () {
           let deltas = [

             ['15px', '15px'], ['15px', '-15px'], ['-15px', '15px'], ['15px', '0px'], ['15px', '0'],

             ['0px', '15px'], ['0', '15px'], ['-15px', '0px'], ['-15px', '0'], ['0px', '-15px'],

             ['0', '-15px'], ['0px'], ['0'], ['15px'], ['-15px'],
           ];

           let _getDeltaY = function _getDeltaY(value) {
             if (!!value) {
               if (value.indexOf('px') === -1) {
                 return value + 'px';
               }

               return value;
             }

             return '0px';
           };

           deltas.forEach(function (delta) {
             let deltaX = delta[0].indexOf('px') > -1 ? delta[0] : delta[0] + 'px';
             let deltaY = _getDeltaY(delta[1]);
             let $el = document.createElement('div');
             updtElTrans($el, delta);
             properties.forEach(function (property) {
               if ($el.style[property] !== undefined) {
                 expect($el.style[property]).to.equal('translate(' + deltaX + ', ' + deltaY + ')');
               }
             });
           });
         });

    });

  });

  describe('buildElement method', function () {

    let buildEl = elifeUtils.buildElement;

    it('creates & returns an instance of the named HTML element', function () {
      let $el = buildEl('div');
      expect($el instanceof HTMLElement).to.be.true;
      expect($el.tagName).to.equal('DIV');
    });

    it('applies the specified CSS classes to the returned HTML element', function () {
      let classes = ['expected-css-class-1', 'expected-css-class-2'];
      let $el = buildEl('div', classes);
      expect($el.classList.contains('expected-css-class-1')).to.be.true;
      expect($el.classList.contains('expected-css-class-2')).to.be.true;
      expect($el.classList).to.have.length(2);
    });

    it('puts specified text inside the element, if supplied', function () {
      let $el = buildEl('div', [], 'Expected text');
      expect($el.innerHTML).equals('Expected text');
    });

    describe('may specify a parent', function () {

      let $parent;
      let parentId;

      beforeEach(function () {
        $parent = document.createElement('div');
        parentId = 'theParent';
        $parent.id = parentId;
        document.querySelector('body').appendChild($parent);
      });

      afterEach(function () {
        document.querySelector('#' + parentId).parentNode
                .removeChild(document.querySelector('#' + parentId));
      });

      it('attaches the new element to a supplied parent element', function () {
        let $el = buildEl('div', [], '', $parent);
        expect($el.parentNode.id).equals(parentId);
      });

      it('attaches the new element to a parent element whose selector is supplied', function () {
        let $el = buildEl('div', [], '', '#' + parentId);
        expect($el.parentNode.id).equals(parentId);
      });

      describe('may specify a following sibling', function () {

        let $followingSibling;
        let followingSiblingId;

        beforeEach(function () {
          $followingSibling = document.createElement('div');
          followingSiblingId = 'theFollowingSibling';
          $followingSibling.id = followingSiblingId;
          $parent.appendChild($followingSibling);
        });

        it('attaches the new element before a supplied following sibling element', function () {
          let $el = buildEl('div', [], '', $parent, $followingSibling);
          expect($el.nextElementSibling.id).equals(followingSiblingId);
        });

        it('attaches the new element before a following sibling element whose selector is supplied',
        function () {
          let $el = buildEl('div', [], '', $parent, '#' + followingSiblingId);
          expect($el.nextElementSibling.id).equals(followingSiblingId);
        });

      });

      describe('may specify the new element to be the first child of a parent', function () {

        it('when the parent has no children', function () {
          buildEl('div', ['new-el'], '', $parent, true);
          expect($parent.firstElementChild.classList.contains('new-el')).to.be.true;
        });

        it('when the parent has one pre-existing child', function () {
          $parent.appendChild(document.createElement('div'));
          buildEl('div', ['new-el'], '', $parent, true);
          expect($parent.firstElementChild.classList.contains('new-el')).to.be.true;
        });

        it('when the parent has multiple pre-existing children', function () {
          $parent.appendChild(document.createElement('div'));
          $parent.appendChild(document.createElement('div'));
          buildEl('div', ['new-el'], '', $parent, true);
          expect($parent.firstElementChild.classList.contains('new-el')).to.be.true;
        });

      });

    });

  });

  describe('areElementsNested method', function () {

    let areNested = elifeUtils.areElementsNested;
    let $siblingA;
    let $siblingB;
    let $parent;
    let $grandParent;

    beforeEach(function () {
      $siblingA = document.createElement('div');
      $siblingB = document.createElement('div');

      $parent = document.createElement('div');
      $parent.appendChild($siblingA);
      $parent.appendChild($siblingB);

      $grandParent = document.createElement('div');
      $grandParent.appendChild($parent);
      document.querySelector('body').appendChild($grandParent);
    });

    afterEach(function () {
      $parent.parentNode.removeChild($parent);
    });

    it('returns false if both arguments are not a Node', function () {
      expect(areNested({}, {})).to.be.false;
      expect(areNested(document.createElement('div'), {})).to.be.false;
      expect(areNested({}, document.createElement('div'))).to.be.false;
    });

    it('returns false if the first argument is a sibling of the second', function () {
      expect(areNested($siblingA, $siblingB)).to.be.false;
    });

    it('returns false if the first argument is a child of the second', function () {
      expect(areNested($siblingA, $parent)).to.be.false;
    });

    it('returns false if the first argument is a non-child descendent of the second', function () {
      expect(areNested($siblingA, $grandParent)).to.be.false;
    });

    it('returns true if the first argument is the parent of the second', function () {
      expect(areNested($parent, $siblingA)).to.be.true;
    });

    it('returns true if the first argument is a non-parent ancestor of the second', function () {
      expect(areNested($grandParent, $siblingA)).to.be.true;
    });

  });

  describe('isIdOfOrWithinSection method', function () {
    const isIdOfOrWithinSection = elifeUtils.isIdOfOrWithinSection;
    let $doc;
    let $parent;
    let $childA;
    let $childB;

    beforeEach(function () {
      $doc = document.createElement('div');

      $parent = document.createElement('div');
      $parent.id = 'foo';
      $doc.appendChild($parent);

      $childA = document.createElement('div');
      $childA.id = 'bar';
      $parent.appendChild($childA);

      $childB = document.createElement('div');
      $childB.id = 'baz';
      $parent.appendChild($childB);
    });

    it('returns true if the id tested matches the section id', function () {
      expect(isIdOfOrWithinSection($parent.id, $parent, $doc)).to.be.true;
    });

    it('returns true if the id tested is a descendant of the section', function () {
      [$childA.id, $childB.id].forEach((childId) => {
        expect(isIdOfOrWithinSection(childId, $parent, $doc)).to.be.true;
      });
    });

    it ('returns false if the id tested is not of or within the section', function () {
      expect(isIdOfOrWithinSection('qux', $parent, $doc)).to.be.false;
    });
  });

});
