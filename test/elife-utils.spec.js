let expect = chai.expect;

// load in component(s) to be tested
let utils = require('../assets/js/libs/elife-utils')();

describe('The utils library', function () {
  "use strict";


  describe('the adjustPxString function', function () {

    context('applies a mathematical operation to a numerical value and a px string (e.g. \'2px\'), returning the adjusted value as a px string', () => {

      it('returns the correct value of an addition operation', () => {
        const data = [
          {
            operation: 'add',
            baseValue: '20px',
            operand: 10,
            expectedResult: '30px'
          },
          {
            operation: 'add',
            baseValue: '-100px',
            operand: 10,
            expectedResult: '-90px'
          }
        ];

        data.forEach((datum) => {
          expect(utils.adjustPxString(datum.baseValue, datum.operand, datum.operation)).to.equal(datum.expectedResult);
        });

      });

      it('returns the correct value of a subtraction operation', () => {
        const data = [
          {
            operation: 'subtract',
            baseValue: '20px',
            operand: 10,
            expectedResult: '10px'
          },
          {
            operation: 'subtract',
            baseValue: '100px',
            operand: 2017,
            expectedResult: '-1917px'
          }
        ];

        data.forEach((datum) => {
          expect(utils.adjustPxString(datum.baseValue, datum.operand, datum.operation)).to.equal(datum.expectedResult);
        });

      });

      it('returns the correct value of a multiplication operation', () => {
        const data = [
          {
            operation: 'multiply',
            baseValue: '20px',
            operand: 10,
            expectedResult: '200px'
          },
          {
            operation: 'multiply',
            baseValue: '-5px',
            operand: 6,
            expectedResult: '-30px'
          },

        ];

        data.forEach((datum) => {
          expect(utils.adjustPxString(datum.baseValue, datum.operand, datum.operation)).to.equal(datum.expectedResult);
        });

      });

      it('returns the correct value of a division operation', () => {
        const data = [
          {
            operation: 'divide',
            baseValue: '200px',
            operand: 10,
            expectedResult: '20px'
          },
          {
            operation: 'divide',
            baseValue: '-12px',
            operand: 6,
            expectedResult: '-2px'
          },
        ];

        data.forEach((datum) => {
          expect(utils.adjustPxString(datum.baseValue, datum.operand, datum.operation)).to.equal(datum.expectedResult);
        });

      });

    });

  });

  describe('the invertPxString function', () => {

    it('makes a positive px string negative, without changing the absolute quantity', () => {
      expect(utils.invertPxString('-99px')).to.equal('99px');
    });

    it('makes a negative px string positive, without changing the absolute quantity', () => {
      expect(utils.invertPxString('99px')).to.equal('-99px');
    });

    it('returns the number 0 as a string if supplied with a zero px string', () => {
      expect(utils.invertPxString('0px')).to.equal('0');
    });

    it('doesn\'t change a "0" string', function () {
      expect(utils.invertPxString('0')).to.equal('0');
    });

  });

  describe('the flatten function', () => {

    it('flattens the upper most nested level of a nested array', () => {
      expect(utils.flatten( [ 1, 2, [ 3, 4 ] ] )).to.have.members( [ 1, 2, 3, 4 ] );
      expect(utils.flatten( [ 1, 2, [ 3, 4, [ 5 ] ] ] )).to.have.deep.members( [ 1, 2, 3, 4, [ 5 ] ] );
    });

  });

  describe('the isIdOfOrWithinSection function', () => {

    let $target;

    before(() => {
      $target = document.querySelector('.isIdOfOrWithinSection').querySelector('.target');
    });

    it('returns true if the supplied id matches that of target element', () => {
      const idOfTargetElement = 'isIdOfOrWithinSection_targetHit';
      expect(utils.isIdOfOrWithinSection(idOfTargetElement, $target, document)).to.be.true;
    });

    it('returns true if an element with the supplied id is a descendant of the target element', () => {
      const idOfChildOfTargetElement = 'isIdOfOrWithinSection_targetHit_child';
      expect(utils.isIdOfOrWithinSection(idOfChildOfTargetElement, $target, document)).to.be.true;

      const idOfGrandChildOfTargetElement = 'isIdOfOrWithinSection_targetHit_grandChild';
      expect(utils.isIdOfOrWithinSection(idOfGrandChildOfTargetElement, $target, document)).to.be.true;
    });

    it('returns false if an element with the supplied id is not a descendant of the target element', () => {
      const idOfExistingElementNotInTreeOfTargetElement = 'isIdOfOrWithinSection_targetMiss';
      expect(utils.isIdOfOrWithinSection(idOfExistingElementNotInTreeOfTargetElement, $target, document)).to.be.false;

      const httpPrefixed = 'http://example.com';
      expect(utils.isIdOfOrWithinSection(httpPrefixed, $target, document)).to.be.false;

      const httpsPrefixed = 'https://example.com';
      expect(utils.isIdOfOrWithinSection(httpsPrefixed, $target, document)).to.be.false;

      const notOnThePage = 'madeUpId';
      expect(utils.isIdOfOrWithinSection(notOnThePage, $target, document)).to.be.false;
    });

  });

  describe('the areElementsNested function', () => {

    let $scope;
    let $referenceElement;

    before(() => {
      $scope = document.querySelector('.areElementsNested');
      $referenceElement = $scope.querySelector('.target');
    });

    it('returns true if the candidate is the reference element', () => {
      expect(utils.areElementsNested($referenceElement, $referenceElement)).to.be.true;
    });

    it('returns true if the candidate is a descendant of the reference element', () => {
      const $childDescendant = $scope.querySelector('.target-child');
      expect(utils.areElementsNested($referenceElement, $childDescendant)).to.be.true;

      const $grandChildDescendant = $scope.querySelector('.target-grand-child');
      expect(utils.areElementsNested($referenceElement, $grandChildDescendant)).to.be.true;
    });

    it('returns false if the candidate is neither the reference element or its descendant', () => {
      const unrelated = [
        $scope.querySelector('.target-miss'),
        1,
        0,
        'a string',
        ['an array'],
        {an: 'object'},
        null,
        undefined,
        true,
        false,
      ];
      unrelated.forEach((item) => {
        expect(utils.areElementsNested($referenceElement, item)).to.be.false;
      });
    });

  });

  describe('the getOrdinalAmongstSiblingElements function', () => {

    let $context;

    before(() => {
      $context = document.querySelector('.getOrdinalAmongstSiblingElements');
    });

    it('correctly identifies an element\'s position within its siblings', () => {
      expect(utils.getOrdinalAmongstSiblingElements($context.querySelector('.child-1a'))).to.equal(1);
      expect(utils.getOrdinalAmongstSiblingElements($context.querySelector('.child-1b'))).to.equal(1);
      expect(utils.getOrdinalAmongstSiblingElements($context.querySelector('.child-2'))).to.equal(2);
      expect(utils.getOrdinalAmongstSiblingElements($context.querySelector('.child-3'))).to.equal(3);
    });

    it('throws a TypeError if not supplied with an HTMLElement', () => {
      expect(() => {utils.getOrdinalAmongstSiblingElements(null)}).to.throw(TypeError, 'Expected HTMLElement');
    });

  });

  describe('the buildElement function', () => {

    let contextClassName = '.buildElement';
    let $context;

    beforeEach(() => {
      $context = document.querySelector(contextClassName);
    });

    context('when supplied an element name', () => {

      const $el = utils.buildElement('div');

      it('creates and returns that element', () => {
        expect($el.nodeName).to.equal('DIV');
      });

    });

    context('when supplied a list of CSS class names', () => {

      const $el = utils.buildElement('div', ['class-1', 'class-2']);

      it('attaches those class names to the element created', () => {
        const classes = $el.classList;
        expect(classes.contains('class-1')).to.be.true;
        expect(classes.contains('class-2')).to.be.true;
        expect(classes).to.have.a.lengthOf(2);
      });

    });

    context('when supplied text content', () => {

      const $el = utils.buildElement('div', [], 'some text');

      it('wraps that text content with the element created', () => {
        expect($el.innerHTML).to.equal('some text');
      });

    });

    context('when not supplied a parent element', () => {

      before(() => {
        expect(document.querySelector('.my-new-element')).to.be.null;
      });

      it('is not inserted into the DOM', () => {
        utils.buildElement('div', ['my-new-element']);
        expect(document.querySelector('.my-new-element')).to.be.null;
      });

    });

    context('when supplied a parent element', () => {

      let $parent;

      beforeEach(() => {
        $parent = $context.querySelector('.parent');
        expect($parent.querySelector('.my-new-element')).to.be.null;
      });

      afterEach(() => {
        [].forEach.call(
          $parent.querySelectorAll('.my-new-element'),
          ($el) => {
            $el.parentNode.removeChild($el);
          });
      });

      context('when the parent element itself is supplied', () => {

        it('the element is appended as the last child of the parent element', () => {
          utils.buildElement('div', ['my-new-element'], '', $parent);
          expect($parent.querySelector('.my-new-element')).not.to.be.null;
        });

      });

      context('when a CSS selector to a parent element is supplied', () => {

        const parentSelector = `${contextClassName} > .parent`;

        it('the element is appended as the last child of the first element matched by that CSS selector', () => {
          // build and attach the element
          utils.buildElement('div', ['my-new-element'], '', parentSelector);

          // grab the parent by how it's defined in this test
          const $parentFromSelector = document.querySelector(parentSelector);

          // the new element should be the last child of it defined parent
          expect($parentFromSelector.lastElementChild.classList.contains('my-new-element')).not.to.be.null;
          expect($parentFromSelector.querySelectorAll('.my-new-element')).to.have.lengthOf(1);

          // other elements matching the CSS selector but that occur later in the document do not have the new element as a child
          const $shouldNotHaveNewElementAsChild = $context.querySelector('.parent.this-second-parent-should-not-match');
          expect($shouldNotHaveNewElementAsChild.querySelector('.my-new-element')).to.be.null;

        });

      });

      context('when supplied an attachBefore argument', () => {

        context('as true', () => {

          it('the new element is inserted as the first child of the parent element', () => {
            utils.buildElement('div', ['my-new-element'], '', $parent, true);
            expect($parent.firstElementChild.classList.contains('my-new-element')).to.be.true;
            expect($parent.querySelectorAll('.my-new-element')).to.have.a.lengthOf(1);
          });

        });

        context('as an element that is a child of the parent element', () => {

          it('the new element is inserted before the supplied element', () => {
            // build and attach the element
            const $attachBeforeMe = $context.querySelector('.pre-existing-sibling-2');
            utils.buildElement('div', ['my-new-element'], '', $parent, $attachBeforeMe);

            // check it's been inserted in the right place
            expect($attachBeforeMe.previousElementSibling.classList.contains('my-new-element')).to.be.true;

            // check it's only been inserted once
            expect($parent.querySelectorAll('.my-new-element')).to.have.a.lengthOf(1);

            // check it's not removed any pre-existing elements
            expect($parent.children).to.have.a.lengthOf(3);
          });

        });

        context('as a CSS selector matching a child of the parent element', () => {

          const followingSiblingSelector = `${contextClassName} .pre-existing-sibling-2`;

          it('the element is appended before the matched element', () => {
            // build and attach the element
            utils.buildElement('div', ['my-new-element'], '', $parent, followingSiblingSelector);

            // grab the following sibling by how it's defined in this test
            const $followingSiblingFromSelector = document.querySelector(followingSiblingSelector);

            //
            expect($followingSiblingFromSelector.previousElementSibling.classList.contains('my-new-element')).to.be.true;

            // check it's only been inserted once
            expect($parent.querySelectorAll('.my-new-element')).to.have.a.lengthOf(1);

            // check it's not removed any pre-existing elements
            expect($parent.children).to.have.a.lengthOf(3);
          });

        });

        context('when the attachBefore element is determined as not being a child of the parent element', () => {

          it('throws a ReferenceError', () => {
            const $notAChildOfStatedParent = $context.querySelector('.not-a-child-of-first-parent');
            expect(() => {
              utils.buildElement('div', ['my-new-element'], '', $parent, $notAChildOfStatedParent);
            }).to.throw(ReferenceError, 'Trying to attach an element with respect to an element sibling, but the two elements do not share a common parent.');

          });

        });

      });

    });

  });

  describe('uniqueIds object', function () {

    let uIds;

    beforeEach(function () {
      uIds = utils.uniqueIds;
    });

    it('keeps track of assigned unique ids', function () {
      expect(uIds.used).to.have.length(0);
      expect(uIds.used.indexOf(uIds.get())).to.equal(0);
      expect(uIds.used).to.have.length(1);
    });

    it('has a get() method', () => {
      expect(uIds.get).to.be.a('function');
    });

    it('has an isValid() method', () => {
      expect(uIds.isValid).to.be.a('function');
    });

    describe('the get() method', function () {

      it('always returns a string with the specified prefix', function () {
        let expectedPrefix = 'prefix';
        for (let i = 0; i < 10; i +=1) {
          expect(uIds.get(expectedPrefix).indexOf(expectedPrefix)).to.equal(0);
        }
      });

    });

    describe('the isValid() method', function () {

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

  describe('the updateElementTranslate function', function () {

    let updtElTrans = utils.updateElementTranslate;

    it('returns false if not passed an HTMLElement', function () {
      expect(updtElTrans({}, [0, 0])).to.be.false;
    });

    it('returns false if not passed an array', function () {
      const noArraysInside = [
        'not-an-array',
        1,
        0,
        1.3,
        true,
        false,
        {not: 'an array'},
        undefined,
        null,
        () => {}
      ];
      noArraysInside.forEach((notArray) => {
        expect(updtElTrans(document.createElement('div'), notArray)).to.be.false;
      });
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


});
