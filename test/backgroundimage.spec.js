let expect = chai.expect;

// load in component(s) to be tested
let BackgroundImage = require('../assets/js/components/BackgroundImage');

describe('A BackgroundImage Component', function () {
  'use strict';
  let $elm;
  let bi;

  beforeEach(function () {
    $elm = document.querySelector('[data-behaviour="BackgroundImage"]');
    bi = new BackgroundImage($elm);
  });

  it('exists', function () {
    expect(bi).to.exist;
  });

  describe('can calculate the image source to use', function () {

    it('possesses the method calcSourceToUse', function () {
      expect(typeof bi.calcSourceToUse).to.equal('function');
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
        expect(bi.calcSourceToUse()).to.equal('');
        expect(bi.calcSourceToUse(false)).to.equal('');
        expect(bi.calcSourceToUse(undefined)).to.equal('');
        expect(bi.calcSourceToUse(null)).to.equal('');
        expect(bi.calcSourceToUse(undefined)).to.equal('');
        expect(bi.calcSourceToUse('')).to.equal('');
      });

      it('returns the high res source if the display has high dpr', function () {
        expect(bi.calcSourceToUse(sourceDefinerWithDatasetMock, true)).to.equal('path/to/high/res/image');
        expect(bi.calcSourceToUse(sourceDefinerNoDatasetMock, true)).to.equal('path/to/high/res/image');
      });

      it('returns the low res source if the display has low dpr', function () {
        expect(bi.calcSourceToUse(sourceDefinerWithDatasetMock, false)).to.equal('path/to/low/res/image');
        expect(bi.calcSourceToUse(sourceDefinerNoDatasetMock, false)).to.equal('path/to/low/res/image');
      });

    });

  });

  describe('derives the css enabling use of the image source for a background image', function () {

    it('possesses the method getBackgroundImagesString', function () {
      expect(typeof bi.getBackgroundImagesString).to.equal('function');
    });

    describe('getBackgroundImagesString', function () {

      it('returns an empty string only if first argument doesn\'t have length > 0', function () {
        expect(bi.getBackgroundImagesString('')).to.equal('');
        expect(bi.getBackgroundImagesString(null)).to.equal('');
        expect(bi.getBackgroundImagesString('a non-empty string')).not.to.equal('');
      });

      it('when first argument is valid, returns: first argument, url(second arg)', function () {
        var observed = bi.getBackgroundImagesString('path', 'test string');
        expect(!!observed.match(/^test string, url\(path\).*/)).to.be.true;
      });

    });

  });

});
