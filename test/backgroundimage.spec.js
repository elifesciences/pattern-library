let expect = chai.expect;
let spy = sinon.spy;

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
      expect(bi.getBackgroundImagesString).to.be.a('function');
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

  describe('can optionally defer loading the image until viewport is of sufficient width',
           function () {

    let invalidValues;

    beforeEach(function () {
      invalidValues = [undefined, null, false, true, [1], {"1": 1}, -1];
    });

    it('validates a value passed as a threshold width only if a non-negative number', function () {
      let validValues = [0, 1, 121.524, 1000];
      expect(typeof bi.isValidThreshold).to.equal('function');
      invalidValues.forEach(function (value) {
        expect(bi.isValidThreshold(value)).to.be.false;
      });
      validValues.forEach(function (value) {
        expect(bi.isValidThreshold(value)).to.be.true;
      });

    });

    it ('initialises image immediately if invalid threshold width specified', function () {
      invalidValues.forEach(function(value) {
        $elm.dataset.thresholdWidth = value;
        let biInValidThreshold = new BackgroundImage($elm);
        expect(biInValidThreshold.sourceToUse).to.be.a('string');
        expect(biInValidThreshold.sourceToUse.length).to.be.at.least(1);

      });
    });

    it('initialises image immediately if no threshold width specified', function () {
      $elm.dataset.thresholdWidth = '';
      let biEmptyThreshold = new BackgroundImage($elm);
      expect(biEmptyThreshold.sourceToUse).to.be.a('string');
      expect(biEmptyThreshold.sourceToUse.length).to.be.at.least(1);

      $elm.removeAttribute('data-threshold-width');
      let biNoThreshold = new BackgroundImage($elm);
      expect(biNoThreshold.sourceToUse).to.be.a('string');
      expect(biNoThreshold.sourceToUse.length).to.be.at.least(1);

    });

    it('does not initialise image if valid threshold width set and viewport too narrow',
       function () {

      let windowMock = {
        innerWidth: 599.5,
        addEventListener: spy(),
        removeEventListener: spy()
      };
      $elm.dataset.thresholdWidth = '600';

      let biThresholdNotMet = new BackgroundImage($elm, windowMock);
      expect(biThresholdNotMet.sourceToUse).to.be.null;

    });

    it('initialises image if a window resize handler call decides threshold width is now met',
       function () {
         let windowMock = {
           innerWidth: 100,
           addEventListener: spy(),
           removeEventListener: spy()
         };
         $elm.dataset.thresholdWidth = '600';

         // Threshold not yet met
         let biThresholdMetLater = new BackgroundImage($elm, windowMock);
         spy(biThresholdMetLater, 'init');

         // Mock that the threshold is now met
         windowMock.innerWidth = 601;
         biThresholdMetLater.resizeHandler();

         expect(biThresholdMetLater.init.called).to.be.true;

         biThresholdMetLater.init.restore();

       });

    it('listens for window resize if valid threshold width not yet met', function () {
      let windowMock = {
        innerWidth: 100,
        addEventListener: spy(),
        removeEventListener: spy()
      };
      $elm.dataset.thresholdWidth = '600';

      new BackgroundImage($elm, windowMock);
      expect(windowMock.addEventListener.calledWith('resize')).to.be.true;
      expect(windowMock.removeEventListener.calledWith('resize')).to.be.false;
    });

    it('stops listening for window resize once valid threshold width has been met', function() {
      let windowMock = {
        innerWidth: 100,
        addEventListener: spy(),
        removeEventListener: spy()
      };
      $elm.dataset.thresholdWidth = '600';

      // Threshold not yet met
      let biThresholdMetLater = new BackgroundImage($elm, windowMock);

      // Mock that the threshold is now met
      windowMock.innerWidth = 601;
      biThresholdMetLater.resizeHandler();
      expect(windowMock.removeEventListener.calledWith('resize')).to.be.true;
    });
  });

});
