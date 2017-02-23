'use strict';

const utils = require('../libs/elife-utils')();

class Metrics {

  constructor($el) {
    this.$el = $el;
    const availableMetrics = [
      'page-views-by-month',
      'downloads-by-month',
      'page-views-by-day',
      'downloads-by-day'
    ];
    this.metrics = availableMetrics.map(metric => ({
      name: metric,
      page: 1,
      periods: [],
      selected: false
    }));

    // We need get these from the DOM, I would prefer a script with JSON.
    this.endpoint = $el.getAttribute('data-api-endpoint');
    this.id = $el.getAttribute('data-id');
    this.type = $el.getAttribute('data-type') || 'article';
    this.perView = $el.getAttribute('data-per-view') || 12;
    this.selected = $el.getAttribute('data-metric') || 'page-views';
    this.period = $el.getAttribute('data-period') || 'month';

    // Select the current metric.
    this.updateSelectedMetric(m => ({ ...m, selected: true }));

    // Register event to call this method.
    this.loadMore().then(data => this.renderView($el, data));
  }

  getEndpoint(url, type, id, metric, by, perPage, page) {
    return `${url}/metrics/${type}/${id}/${metric}?by=${by}&per-page=${perPage}&page=${page}`;
  }

  getSelectedName() {
    return `${this.selected}-by-${this.period}`;
  }

  updateSelectedMetric(fn) {
    this.metrics = this.metrics.map(m => m.name === this.getSelectedName() ? fn(m) : m);
  }

  getSelectedMetric() {
    return this.metrics.find(m => m.name === this.getSelectedName());
  }

  saveResults(data) {
    // Add the results to the metrics store.
    this.updateSelectedMetric(m => ({ ...m, periods: this.transformPeriods(m.periods.concat(data.periods)) }));
  }

  transformPeriods(periods) {
    // Converts 2015-11-01 to { year: 2015, month: 11, day: 1 }
    return periods.map(({ value, period }) => {
      const [year, month, day] = period.period.split('-');
      return { year, month, day, value };
    });
  }

  renderView($el, data) {
    // Update BarChart data
  }

  loadMore() {
    if (this.lock) {

    }
    this.lock = Promise.defer();
    // The next XHR
    this.currentRrequest = utils.getJson(
        this.getEndpoint(
            this.endpoint,
            this.type,
            this.id,
            this.selected,
            this.period,
            this.perView,
            this.getSelectedMetric().page
        )
    );

    return this.currentRrequest
        .then(j => JSON.parse(j))
        .then(json => {
          this.saveResults(json);
          this.total = json.totalPeriods || 0;
          this.remaining = this.total - this.perView;
          this.remainingPages = Math.ceil(this.remaining / this.perView);
          this.lock.resolve9);
        })
  }
}

module.exports = Metrics;
