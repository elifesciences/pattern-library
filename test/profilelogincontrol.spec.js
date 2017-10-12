let expect = chai.expect;

// load in component(s) to be tested
let ProfileLoginControl = require('../assets/js/components/ProfileLoginControl');


describe('A ProfileLoginControl Component', function () {
  'use strict';
  let $elm;
  let profileLoginControl;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="ProfileLoginControl"]');
    profileLoginControl = new ProfileLoginControl($elm);
  });

  it('exists', function () {
    expect(ProfileLoginControl).to.exist;
  });

  describe('for data attribute handling', () => {

    let invalidDataAttributeRoots;
    let validDataAttributeRoots;

    beforeEach(function () {
      invalidDataAttributeRoots = [
        undefined,
        null,
        {},
        {'fish': 'chips'},
        [],
        ['fish', 'chips'],
        1,
        0,
        true,
        false,
        'there should be no spaces without commas',
        'any spaces,should only be around commas',
        'any spaces, should only be around commas',
        'any spaces ,should only be around commas',
        'any spaces , should only be around commas',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames?plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames!plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames@plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames%plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames^plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames&plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames*plus-hyphens, commas,andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames)plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames(plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames}plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames{plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames]plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames[plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames.plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames"plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames\'plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames;plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames:plus-hyphens, commas, andSpaces',
        'shouldOnlyContainCharactersUseableWithinJavaScriptNames/plus-hyphens, commas, andSpaces',
        'hyphens-should-not-be-at-the-end-of-the-string-',
        'hyphens-should-not-be-at-the-end-of-a-word-, in-the-string',
        '-hyphens-should-not-be-at-the-start-of-the-string',
        'hyphens-should-not-be-at-the-start-of-a, -word-in-the-string'
      ];

      validDataAttributeRoots = [
        // An empty string is probably missing something, but is not technically invalid
        '',
        'justalphabeticalchars',
        'ihaveacomma,butnospaces',
        'ihaveacomma, andnospacesexceptnexttothecomma',
        'ihaveacomma ,andnospacesexceptnexttothecomma',
        'ihaveacomma , andnospacesexceptnexttothecomma',
        'ihaveacomma , andnospacesexceptnexttothecomma, morevalues',
        '    terminalspacebothendsihaveacomma , andnospacesexceptnexttothecomma, morevalues ',
        ',leadingCommasShouldJustBeIgnored',
        'trailingCommasShouldJustBeIgnored,',
        'shouldOnlyContainCharactersUseableWithinJavaScriptName$_plus-Hyphens, andSpaces'
      ];

    });

    it('has a validateDataAttributeRootsList static method', () => {
      expect(ProfileLoginControl.validateDataAttributeRootsList).to.be.a('function');
    });

    describe('the validateDataAttributeRootsList method', () => {

      it('returns false if supplied with an invalid value', () => {
        invalidDataAttributeRoots.forEach((invalidValue) => {
          expect(ProfileLoginControl.validateDataAttributeRootsList(invalidValue)).to.be.false;
        });
      });

      it('returns true if supplied with a valid value', () => {
        validDataAttributeRoots.forEach((validValue) => {
          expect(ProfileLoginControl.validateDataAttributeRootsList(validValue)).to.be.true;
        });

      });
    });

    it('has a deriveDataAttributeRoots static method', () => {
      expect(ProfileLoginControl.deriveDataAttributeRoots).to.be.a('function');
    });

    describe('the deriveDataAttributeRoots method', () => {

      context('when supplied with an invalid argument', () => {

        it('throws a SyntaxError with the message "invalid roots list supplied"', () => {
          invalidDataAttributeRoots.forEach((invalidArgument) => {
            const shouldThrow = () => ProfileLoginControl.deriveDataAttributeRoots(invalidArgument, $elm);
            expect(shouldThrow).to.throw(SyntaxError, 'invalid roots list supplied');
          });
        });
      });

      context('when supplied with a syntactically valid string but one that implies data attributes which are actually missing', () => {

        const validStringButInvalidRoot = 'missing-attribute';

        it('throws a ReferenceError with the message "One or more required data attributes implied by data-link-field-roots are missing"', () => {
          const shouldThrow = () => ProfileLoginControl.deriveDataAttributeRoots(validStringButInvalidRoot, $elm);
          expect(shouldThrow).to.throw(ReferenceError, 'One or more required data attributes implied by data-link-field-roots are missing');
        });

      });

      context('when supplied with a valid string with no spaces or commas', () => {

        const stringWithNoSpacesCommas = 'logout';

        it('returns an array with the argument unaltered as its only element', () => {
          const observed = ProfileLoginControl.deriveDataAttributeRoots(stringWithNoSpacesCommas,
                                                                        $elm);
          expect(observed).to.have.lengthOf(1);
          expect(observed[0]).to.equal(stringWithNoSpacesCommas);
        });

      });

      context('when supplied with a valid string with commas', () => {

        const stringWithCommas = 'profile-manager, logout';

        it('returns an array containing elements from the string, as split by the commas', () => {
          const observed = ProfileLoginControl.deriveDataAttributeRoots(stringWithCommas, $elm);
          expect(observed).to.have.lengthOf(2);
          expect(observed[0]).to.equal('profile-manager');
          expect(observed[1]).to.equal('logout');

        });

      });

    });

    it('has a setPropertiesFromDataAtributes method', () => {
      expect(profileLoginControl.setPropertiesFromDataAttributes).to.be.a('function');
    });

    it('has a a displayName property set from the display-name data attribute', () => {
      const valueFromDataAttribute = $elm.dataset.displayName;
      expect(profileLoginControl.displayName).to.equal(valueFromDataAttribute);
    });

    it('has a a profileHomeUri property set from the profile-home-uri data attribute', () => {
      const valueFromDataAttribute = $elm.dataset.profileHomeUri;
      expect(profileLoginControl.profileHomeUri).to.equal(valueFromDataAttribute);
    });

  });

  it('has a convertKebabCaseToCamelCase static method', () => {
    expect(ProfileLoginControl.convertKebabCaseToCamelCase).to.be.a('function');
  });


  describe('the convertKebabCaseToCamelCase method', () => {

      it('returns null if not provided with a string at least one character long', () => {
        const invalidValues = [
          undefined,
          null,
          {},
          {'fish': 'chips'},
          [],
          ['fish', 'chips'],
          '',
          1,
          0,
          true,
          false
        ];

        invalidValues.forEach((invalidValue) => {
          expect(ProfileLoginControl.convertKebabCaseToCamelCase(invalidValue)).to.be.null;
        });

      });

      context('when provided with a string containing hyphens', () => {

        const hyphenContainingString = 'i-am-a-hyphen-containing-string';

        it('strips the hyphens and camel cases the string into a compound word', () => {
          const expected = 'iAmAHyphenContainingString';
          expect(ProfileLoginControl.convertKebabCaseToCamelCase(hyphenContainingString)).to.equal(
            expected);
        });

      });

    });

});

