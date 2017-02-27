const expect = chai.expect;

const Metrics = require('../assets/js/components/Metrics');

function assertSvgContainerText(svg, text) {
  if (svg instanceof SVGElement) {
    const str = svg.innerHTML;
    if (str.search(new RegExp(`${text}`)) === -1) {
      throw new Error(`${text} not found in svg`);
    }
  }
}

function assertSvgDoesNotContainText(svg, text) {
  if (svg instanceof SVGElement) {
    const str = svg.innerHTML;
    if (str.search(new RegExp(`${text}`)) !== -1) {
      throw new Error(`${text} was found in svg`);
    }
  }
}

describe('Metrics integration', function () {
  'use strict';
  const root = {
    nextJson: null,
    metrics: null,
    $elm: null
  };

  // Mocks
  Metrics.prototype.getJsonPage = function () {
    return Promise.resolve(
        root.nextJson ||
        '{"totalValue":15014,"totalPeriods":542,"periods":[{"period":"2015-09-04","value":1},{"period":"2015-09-05","value":0},{"period":"2015-09-06","value":0},{"period":"2015-09-07","value":3},{"period":"2015-09-08","value":0},{"period":"2015-09-09","value":1},{"period":"2015-09-10","value":4652},{"period":"2015-09-11","value":1533},{"period":"2015-09-12","value":489},{"period":"2015-09-13","value":417},{"period":"2015-09-14","value":480},{"period":"2015-09-15","value":333},{"period":"2015-09-16","value":255},{"period":"2015-09-17","value":293},{"period":"2015-09-18","value":167},{"period":"2015-09-19","value":106},{"period":"2015-09-20","value":115},{"period":"2015-09-21","value":148},{"period":"2015-09-22","value":112},{"period":"2015-09-23","value":85},{"period":"2015-09-24","value":61},{"period":"2015-09-25","value":70},{"period":"2015-09-26","value":28},{"period":"2015-09-27","value":56},{"period":"2015-09-28","value":61},{"period":"2015-09-29","value":49},{"period":"2015-09-30","value":51},{"period":"2015-10-01","value":52},{"period":"2015-10-02","value":39},{"period":"2015-10-03","value":28}]}'
    );
  };

  root.$elm = document.querySelector('[data-behaviour="Metrics"]');
  root.metrics = new Metrics(root.$elm, window, window.document);

  it('exists', function () {
    expect(root.metrics).to.exist;
  });

  it('should create a list of available metrics', function () {
    const available = root.metrics.availableCharts;
    expect(available).to.contains('page-views');
    expect(available).to.contains('downloads');
    expect(available.length).to.equal(2);
  });

  it('should create a list of objects for each metric', function () {
    const availableViews = root.metrics.metrics;
    availableViews.forEach(function (view) {
      expect(view.name).to.be.a('string');
      if (view.loaded === true) {
        expect(view.loaded).to.equal(true);
        expect(view.page).to.equal(1);
        expect(view.periods.length).to.equal(30);
      } else {
        expect(view.loaded).to.equal(false);
        expect(view.page).to.equal(0);
        expect(view.periods.length).to.equal(0);
      }
    });
  });

  it('should accurately return selected metric', function () {
    const currentMetric = root.metrics.getSelectedMetric();
    expect(currentMetric.name).to.equal('downloads-by-day');
    expect(currentMetric.page).to.equal(1);
    expect(currentMetric.periods.length).to.equal(30);
    expect(currentMetric.remaining).to.equal(18);
    expect(currentMetric.selected).to.equal(true);
    expect(currentMetric.periods[0].value).to.equal(1);
    expect(currentMetric.periods[10].value).to.equal(480);
  });


  /**************************************
   *          START MUTATIONS           *
   **************************************/

  it('should handle user input', function () {

    it('should switch metric', function (done) {
      root.nextJson = '{"totalValue":210665,"totalPeriods":542,"periods":[{"period":"2015-09-04","value":14},{"period":"2015-09-05","value":1},{"period":"2015-09-06","value":8},{"period":"2015-09-07","value":50},{"period":"2015-09-08","value":47},{"period":"2015-09-09","value":61},{"period":"2015-09-10","value":74297},{"period":"2015-09-11","value":22361},{"period":"2015-09-12","value":9680},{"period":"2015-09-13","value":6516},{"period":"2015-09-14","value":6014},{"period":"2015-09-15","value":4201},{"period":"2015-09-16","value":3621},{"period":"2015-09-17","value":3218},{"period":"2015-09-18","value":2083},{"period":"2015-09-19","value":1689},{"period":"2015-09-20","value":1741},{"period":"2015-09-21","value":1906},{"period":"2015-09-22","value":1430},{"period":"2015-09-23","value":1243},{"period":"2015-09-24","value":991},{"period":"2015-09-25","value":850},{"period":"2015-09-26","value":568},{"period":"2015-09-27","value":679},{"period":"2015-09-28","value":809},{"period":"2015-09-29","value":869},{"period":"2015-09-30","value":786},{"period":"2015-10-01","value":778},{"period":"2015-10-02","value":553},{"period":"2015-10-03","value":478}]}';
      // Change period
      root.metrics.changeMetric('page-views', 'day').then(function () {
        const currentMetric = root.metrics.getSelectedMetric();
        expect(currentMetric.name).to.equal('page-views-by-day');
        expect(currentMetric.page).to.equal(1);
        expect(currentMetric.periods.length).to.equal(30);
        expect(currentMetric.remaining).to.equal(18);
        expect(currentMetric.selected).to.equal(true);
        expect(currentMetric.periods[0].value).to.equal(14);
        expect(currentMetric.periods[10].value).to.equal(6014);
      }).then(done).catch(done);
    });

    it('should render the view to the DOM', function () {
      const svg = root.$elm.querySelector('.highcharts-root');
      // Initial view.
      assertSvgContainerText(svg, 'Downloads');
      assertSvgDoesNotContainText(svg, 'Page Views');
      // Render.
      root.metrics.renderView(root.metrics.$elm, root.metrics.getSelectedMetric());
      // Changed title.
      assertSvgContainerText(svg, 'Page Views');
      assertSvgDoesNotContainText(svg, 'Downloads');
    });

  });

});
