let expect = chai.expect;

// load in component(s) to be tested
let BackgroundImage = require('../assets/js/components/BackgroundImage');

describe('A BackgroundImage Component', function () {
  'use strict';
  let $elm;
  let chbi;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="BackgroundImage"]');
    chbi = new BackgroundImage($elm);
  });

  it('exists', function () {
    expect(chbi).to.exist;
  });

  describe('can calculate the image source to use', function () {

    it('possesses the method calcSourceToUse', function () {
      expect(typeof chbi.calcSourceToUse).to.equal('function');
    });

    describe('calcSourceToUse', function () {

      var sourceDefinerWithDatasetMock;
      var sourceDefinerNoDatasetMock;

      beforeEach(function () {
        sourceDefinerWithDatasetMock = {
          dataset: {
            highResImageSource: 'path/to/high/res/image',
            lowResImageSource: 'path/to/low/res/image'
          }
        };

        sourceDefinerNoDatasetMock = {
          getAttribute: function(attr) {
            if (attr === 'data-highResImageSource') {
              return 'path/to/high/res/image';
            }
            if (attr === 'data-lowResImageSource') {
              return 'path/to/low/res/image';
            }
          }
        };
      });

      it('returns empty string if the argument specifying where the sources are defined is not defined', function () {
        expect(chbi.calcSourceToUse()).to.equal('');
        expect(chbi.calcSourceToUse(false)).to.equal('');
        expect(chbi.calcSourceToUse(undefined)).to.equal('');
        expect(chbi.calcSourceToUse(null)).to.equal('');
        expect(chbi.calcSourceToUse(undefined)).to.equal('');
        expect(chbi.calcSourceToUse('')).to.equal('');
      });

      it('returns the high res source if the display has high dpr', function () {
        expect(chbi.calcSourceToUse(sourceDefinerWithDatasetMock, true)).to.equal('path/to/high/res/image');
        expect(chbi.calcSourceToUse(sourceDefinerNoDatasetMock, true)).to.equal('path/to/high/res/image');
      });

      it('returns the low res source if the display has low dpr', function () {
        expect(chbi.calcSourceToUse(sourceDefinerWithDatasetMock, false)).to.equal('path/to/low/res/image');
        expect(chbi.calcSourceToUse(sourceDefinerNoDatasetMock, false)).to.equal('path/to/low/res/image');
      });

    });

  });

  describe('derives the css enabling use of the image source for a background image', function () {

    it('possesses the method setBackground', function () {
      expect(typeof chbi.setBackground).to.equal('function');
    });

    describe('setBackground', function () {

      it('returns an empty string only if first argument doesn\'t have length > 0', function () {
        expect(chbi.setBackground('')).to.equal('');
        expect(chbi.setBackground(null)).to.equal('');
        expect(chbi.setBackground('a non-empty string')).not.to.equal('');
      });

      it('when first argument is valid, returns: first argument, url(second arg)', function () {
        var observed = chbi.setBackground('path', 'test string');
        expect(!!observed.match(/^test string, url\(path\).*/)).to.be.true;
      });

    });

  });

});
