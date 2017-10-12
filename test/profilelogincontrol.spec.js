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

  it('has validateDataAttributeRootsList static method', () => {
    expect(ProfileLoginControl.validateDataAttributeRootsList).to.be.a('function');
  });

  describe('the validateDataAttributeRootsList method', () => {

    it('returns false if supplied with an invalid value', () => {
      const invalidValues = [
        undefined,
        null,
        {},
        { 'fish': 'chips'},
        [],
        [ 'fish','chips'],
        1,
        0,
        true,
        false,
        'there should be no spaces without commas',
        'if spaces,they should only be around commas',
        'if spaces, they should only be around commas',
        'if spaces ,they should only be around commas',
        'if spaces , they should only be around commas',
      ];
      invalidValues.forEach((invalidValue) => {
        expect(ProfileLoginControl.validateDataAttributeRootsList(invalidValue)).to.be.false;
      });
    });

    it('returns true if supplied with a valid value', () => {
      const validValues = [
        // An empty string is probablg missing something, but is not tecnically invalid
        '',
        'justalphabeticalchars',
        'ihaveacomma,butnospaces',
        'ihaveacomma, andnospacesexceptnexttothecomma',
        'ihaveacomma ,andnospacesexceptnexttothecomma',
        'ihaveacomma , andnospacesexceptnexttothecomma',
        'ihaveacomma , andnospacesexceptnexttothecomma, morevalues',
        '    terminalspacebothendsihaveacomma , andnospacesexceptnexttothecomma, morevalues ',
      ];
      validValues.forEach((validValue) => {
        expect(ProfileLoginControl.validateDataAttributeRootsList(validValue)).to.be.true;
      });

    });
  });

  it('has deriveDataAttributeRoots static method', () => {
    expect(ProfileLoginControl.deriveDataAttributeRoots).to.be.a('function');
  });

  describe('the deriveDataAttributeRoots method', () => {

    context('when supplied with an invalid argument', () => {

      const invalidArgument = 'invalid argument';

      it('throws a SyntaxError with the message "invalid roots list supplied"', () => {
        expect(() => ProfileLoginControl.deriveDataAttributeRoots(invalidArgument, $elm)).to.throw(SyntaxError, 'invalid roots list supplied');
      });
    });

    context('when supplied with a valid string with no spaces or commas', () => {

      const stringWithNoSpacesCommas = 'logout';

      it('returns an array with the argument unaltered as its only element', () => {
        const observed = ProfileLoginControl.deriveDataAttributeRoots(stringWithNoSpacesCommas, $elm);
        expect(observed).to.have.lengthOf(1);
        expect(observed[0]).to.equal(stringWithNoSpacesCommas);
      });

    });

    context('when supplied with a valid string with commas', () => {

      it('returns an array containing elements from the string, as split by the commas', () => {
        const stringWithCommas = 'profile-manager, logout';
        const observed = ProfileLoginControl.deriveDataAttributeRoots(stringWithCommas, $elm);
        expect(observed).to.have.lengthOf(2);
        expect(observed[0]).to.equal('profile-manager');
        expect(observed[1]).to.equal('logout');

      });

    });

  });

  it('has convertKebabCaseToCamelCase static method', () => {
    expect(ProfileLoginControl.convertKebabCaseToCamelCase).to.be.a('function');
  });

  describe('the convertKebabCaseToCamelCase method', () => {

    it('returns null if not provided with a non empty string', () => {
      const invalidValues = [
        undefined,
        null,
        {},
        { 'fish': 'chips'},
        [],
        [ 'fish','chips'],
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
        expect(ProfileLoginControl.convertKebabCaseToCamelCase(hyphenContainingString)).to.equal(expected);
      });

    });

  });

  it('has setPropertiesFromDataAtributes method', () => {
    expect(profileLoginControl.setPropertiesFromDataAttributes).to.be.a('function');
  });

  it('has a displayName property', () => {
    expect(profileLoginControl.displayName).to.not.be.empty;
  });

  it('has a profileHomeUri property', () => {
    expect(profileLoginControl.profileHomeUri).to.not.be.empty;
  });

});

