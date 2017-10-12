let expect = chai.expect;

// load in component(s) to be tested
let ProfileLoginControl = require('../assets/js/components/ProfileLoginControl');

function checkTextFixturePrerequisites($fixture) {
  'use strict';
  // Ensure the expected data attributes are present on the test fixture
  expect($fixture.dataset.linkFieldRoots).to.equal('profile-manager, logout');
  expect($fixture.data.profileManagerUri).to.not.be.empty();
  expect($fixture.data.profileManagerText).to.not.be.empty();
  expect($fixture.data.logoutUri).to.not.be.empty();
  expect($fixture.data.logoutText).to.not.be.empty();
}

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

  describe('for handling its data attributes', () => {

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
        'hyphens-should-not-be-at-the-start-of-a, -word-in-the-string',
        ',shouldnothavealeadingcomma',
        'shouldnothaveareainingcomma,',
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

      context('when supplied with a valid string containing commas', () => {

        const stringWithCommas = 'profile-manager, logout';

        it('returns an array containing elements from the string, as split by the commas', () => {
          const observed = ProfileLoginControl.deriveDataAttributeRoots(stringWithCommas, $elm);
          expect(observed).to.have.lengthOf(2);
          expect(observed[0]).to.equal('profile-manager');
          expect(observed[1]).to.equal('logout');
        });

      });

    });


    it('has an areAllImpliedDataAttributesPresent static method', () => {
      expect(ProfileLoginControl.areAllImpliedDataAttributesPresent).to.be.a('function');
    });

    describe('the areAllImpliedDataAttributesPresent method', () => {

      context('when both the implied "-uri" and "-text" suffixed data attributes are present for each data attribute root specified in the supplied array ', () => {

        it('returns true', () => {
          expect(
            ProfileLoginControl.areAllImpliedDataAttributesPresent(['profile-manager', 'logout'],
                                                                   $elm)).to.be.true;
        });

      });

      context('when a "-uri" suffixed data attribute implied by a data attribute root specified in the supplied array is missing', () => {

        let logoutUriBackup;

        before(() => {
          expect(ProfileLoginControl.areAllImpliedDataAttributesPresent(['profile-manager','logout'], $elm)).to.be.true;
          logoutUriBackup = $elm.dataset.logoutUri;
        });

        after(() => {
          $elm.dataset.logoutUri = logoutUriBackup;
          expect(ProfileLoginControl.areAllImpliedDataAttributesPresent(['profile-manager','logout'], $elm)).to.be.true;
        });

        it('returns false', () => {
          delete $elm.dataset.logoutUri;
          expect(ProfileLoginControl.areAllImpliedDataAttributesPresent(['profile-manager','logout'], $elm)).to.be.false;
        });

    });

    context('when a "-text" suffixed data attribute implied by a data attribute root specified in the supplied array is missing', () => {

      let logoutTextBackup;

      before(() => {
        expect(ProfileLoginControl.areAllImpliedDataAttributesPresent(['profile-manager','logout'], $elm)).to.be.true;
        logoutTextBackup = $elm.dataset.logoutText;
      });

      after(() => {
        $elm.dataset.logoutText = logoutTextBackup;
        expect(ProfileLoginControl.areAllImpliedDataAttributesPresent(['profile-manager','logout'], $elm)).to.be.true;
      });

      it('returns false', () => {
        delete $elm.dataset.logoutText;
        expect(ProfileLoginControl.areAllImpliedDataAttributesPresent(['profile-manager','logout'], $elm)).to.be.false;
      });

    });

  });

    it('has a deriveLinksToBuild static method', () => {
      expect(ProfileLoginControl.deriveLinksToBuild).to.be.a('function');
    });

    describe('the deriveLinksToBuild method', () => {

      context('when supplied with an array specifying the data attribute roots "profile-manage-link" and "logout"', () => {

        const dataAttributeRoots = ['profile-manager', 'logout'];

        it('returns an object with the properties "text" and "uri" assigned the values of the respective implied data attributes', () => {

          before(() => {
            checkTextFixturePrerequisites($elm);
          });

          const observed = ProfileLoginControl.deriveLinksToBuild(dataAttributeRoots, $elm);
          expect(observed[0].uri).to.equal($elm.dataset.profileManagerUri);
          expect(observed[0].text).to.equal($elm.dataset.profileManagerText);
          expect(observed[1].uri).to.equal($elm.dataset.logoutUri);
          expect(observed[1].text).to.equal($elm.dataset.logoutText);
        });

      });

      context('when supplied with an array containing a data attribute root, where one of its implied data attributes is empty', () => {

        const dataAttributeRoots = ['logout', 'emptyLinkText', 'emptyLinkUri'];

        before(() => {
          $elm.dataset.emptyLinkUriText = 'Empty link URI text';
          $elm.dataset.emptyLinkUriUri = '';
          $elm.dataset.emptyLinkTextText = '';
          $elm.dataset.emptyLinkTextUri = '#emptyLinkTextUri';
        });

        after(() => {
          delete $elm.dataset.emptyLinkUriText;
          delete $elm.dataset.emptyLinkUriUri;
          delete $elm.dataset.emptyLinkTextText;
          delete $elm.dataset.emptyLinkTextUri;
        });

        it('that data attribute root is not used to derive the return value', () => {
          const observed = ProfileLoginControl.deriveLinksToBuild(dataAttributeRoots, $elm);
          expect(observed).to.have.a.lengthOf(1);
          expect(observed[0].uri).to.equal($elm.dataset.logoutUri);
          expect(observed[0].text).to.equal($elm.dataset.logoutText);
        });

      });

    });

    it('has an extraLinksToBuild property with a value derived from the link-field-roots data attribute value', () => {

      before(() => {
        checkTextFixturePrerequisites($elm);
      });

      const observed = profileLoginControl.extraLinksToBuild;
      expect(observed[0].uri).to.equal($elm.dataset.profileManagerUri);
      expect(observed[0].text).to.equal($elm.dataset.profileManagerText);
      expect(observed[1].uri).to.equal($elm.dataset.logoutUri);
      expect(observed[1].text).to.equal($elm.dataset.logoutText);
    });

    it('has a  displayName property set from the display-name data attribute', () => {
      const valueFromDataAttribute = $elm.dataset.displayName;
      expect(profileLoginControl.displayName).to.equal(valueFromDataAttribute);
    });

    it('has a  profileHomeUri property set from the profile-home-uri data attribute', () => {
      const valueFromDataAttribute = $elm.dataset.profileHomeUri;
      expect(profileLoginControl.profileHomeUri).to.equal(valueFromDataAttribute);
    });

  });

  it('has a convertKebabCaseToCamelCase static method', () => {
    expect(ProfileLoginControl.convertKebabCaseToCamelCase).to.be.a('function');
  });

  describe('its DOM', () => {

    it('has a $control property that is a <nav> element', () => {
      expect(profileLoginControl.$control).to.be.an.instanceOf(HTMLElement);
      expect(profileLoginControl.$control.nodeName).to.equal('NAV');
    });

    describe('the $control property', () => {

      it('has a toggle', () => {
        expect($elm.querySelector('.profile-login-control__controls_toggle')).not.to.be.null;
      });

      it('has a profile home link that has its URI value specified by the profile-home-uri data attribute', () => {
        const expected = $elm.dataset.profileHomeUri;
        expect($elm.querySelector(`[href="${expected}"]`)).not.to.be.null;
      });

      it('has a display name specified by the display-name data attribute', () => {
        const expected = $elm.dataset.displayName;
        expect($elm.querySelector('.profile-login-control__display_name').innerHTML).to.equal(expected);
      });

      describe('the extra links', () => {

        it('are present and correct as implied by the value of the link-field-roots data attribute', () => {

          before(() => {
            checkTextFixturePrerequisites($elm);
          });

          const profileManagerLink = $elm.querySelector(`[href="${$elm.dataset.profileManagerUri}"]`);
          expect(profileManagerLink.innerHTML).to.equal($elm.dataset.profileManagerText);
          const logoutLink = $elm.querySelector(`[href="${$elm.dataset.logoutUri}"]`);
          expect(logoutLink.innerHTML).to.equal($elm.dataset.logoutText);
        })

      })

    });

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

