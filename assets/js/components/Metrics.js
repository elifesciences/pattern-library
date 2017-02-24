'use strict';

const utils = require('../libs/elife-utils')();
const BarChart = require('./BarChart');

class Metrics {

  constructor($el) {
    this.$el = $el;

    // We need get these from the DOM, I would prefer a script with JSON.
    this.endpoint = $el.getAttribute('data-api-endpoint');
    this.id = $el.getAttribute('data-id');
    this.type = $el.getAttribute('data-type') || 'article';
    this.selected = $el.getAttribute('data-metric') || 'downloads';
    this.period = $el.getAttribute('data-period') || 'day';
    this.$dailyButton = $el.querySelector(`#${$el.getAttribute('data-daily-id')}`);
    this.$monthlyButton = $el.querySelector(`#${$el.getAttribute('data-monthly-id')}`);
    this.$prev = $el.querySelector('.trigger--prev');
    this.$next = $el.querySelector('.trigger--next');
    this.availableCharts = ['page-views', 'downloads'];
    this.availablePeriods = ['day', 'month'];
    this.currentChart = this.availableCharts.indexOf(this.selected);

    // Name each chart in format like "downloads-by-day"
    const availableMetrics = utils.flatten(
        this.availableCharts.map(
            chart => this.availablePeriods.map(
                period => `${chart}-by-${period}`
            )
        )
    );

    this.loadMore = this.loadMore.bind(this);
    this.barChart = new BarChart($el.getAttribute('data-container-id'));
    this.metrics = availableMetrics.map(metric => ({
      name: metric,
      page: 0,
      remaining: 1,
      periods: [],
      selected: false,
      loaded: false
    }));

    // data-daily-id
    this.$prev.addEventListener('click', this.previousButton.bind(this));
    this.$next.addEventListener('click', this.nextButton.bind(this));
    if (this.$dailyButton) {
      this.$dailyButton.addEventListener('click', this.changePeriod('day').bind(this));
    }

    if (this.$monthlyButton) {
      this.$monthlyButton.addEventListener('click', this.changePeriod('month').bind(this));
    }

    // Select the current metric.
    this.updateSelectedMetric(function (m) {
      return Object.assign(m, { selected: true });
    });

    // Register event to call this method.
    this.loadMore().then(function () {
      return this.renderView($el, this.getSelectedMetric());
    }.bind(this));
  }

  changePeriod(period) {
    return (e) => {

      // Change button style.
      this.$el
          .querySelector('.button-collection__button--active')
          .classList.remove('button-collection__button--active');
      e.currentTarget.classList.add('button-collection__button--active');
      this.log(`changed period to ${period}`);

      // Change metric and reload.
      this.changeMetric(
          this.selected,
          period
      ).then(() => {
        this.renderView(this.$el, this.getSelectedMetric());
      });
    };
  }

  isFirstPage() {
    return this.currentChart <= 0;
  }

  isLastPage() {
    return this.currentChart >= (this.availableCharts.length - 1);
  }

  previousButton() {
    if (this.isFirstPage()) {
      return null;
    }

    this.currentChart = this.currentChart - 1;
    this.changeMetric(
        this.availableCharts[this.currentChart],
        this.period
    ).then(() => {
      this.renderView(this.$el, this.getSelectedMetric());
    });
  }

  nextButton() {
    if (this.isLastPage()) {
      return null;
    }

    this.currentChart = this.currentChart + 1;
    this.changeMetric(
        this.availableCharts[this.currentChart],
        this.period
    ).then(() => {
      this.renderView(this.$el, this.getSelectedMetric());
    });
  }

  getEndpoint(url, type, id, metric, by, perPage, page) {
    return `${url}/metrics/${type}/${id}/${metric}?by=${by}&per-page=${perPage}&page=${page}`;
  }

  changeMetric(metric, period) {
    if (this.isLocked) {
      this.log('Finishing in progress requests first');
      return this.lock.then(() => this.changeMetric(metric, period));
    }

    // Select the current metric.
    this.updateSelectedMetric(function (m) {
      return Object.assign(m, { selected: false });
    });

    this.selected = metric;
    this.period = period;
    let isLoaded;

    // Select the current metric.
    this.updateSelectedMetric(function (m) {
      isLoaded = m.loaded;
      return Object.assign(m, { selected: true });
    });

    this.log('Changed metric to ', metric, period, ', loaded: ', isLoaded);
    return Promise.resolve(isLoaded ? null : this.loadMore());
  }

  getSelectedName() {
    this.log('selected name: ', `${this.selected}-by-${this.period}`);
    return `${this.selected}-by-${this.period}`;
  }

  updateSelectedMetric(fn) {
    this.metrics = this.metrics.map(m => m.name === this.getSelectedName() ? fn(m) : m);
  }

  getSelectedMetric() {
    for (const metric of this.metrics) {
      if (metric.name === this.getSelectedName()) {
        return metric;
      }

    }

  }

  saveResults(data, page, remaining) {
    this.log('saving results', data);

    // Add the results to the metrics store.
    this.updateSelectedMetric(function (m) {
      m.periods = m.periods.concat(this.transformPeriods(data.periods));
      m.page = page;
      m.loaded = true;
      m.remaining = remaining;
      return m;
    }.bind(this));
  }

  transformPeriods(periods) {
    this.log(periods);

    // Converts 2015-11-01 to { year: 2015, month: 11, day: 1 }
    return periods.map(({ value, period }) => {
      const p = period.split('-');
      const year = p[0];
      const month = p[1];

      const minimum = { year, month, value };
      if (p[2]) {
        minimum.day = p[2];
      }

      // const [year, month, day] = period.split('-');
      return minimum;
    });
  }

  log(...args) {
    // console.info('—>', ...args);
  }

  renderView($el, data) {
    this.barChart.updateFromJson({
      data: {
        totalPeriods: data.totalPeriods,
        totalValue: data.totalValue,
        periods: data.periods.map((entry) => {
          const period = Date.UTC(entry.year, entry.month, entry.day ? entry.day : 1);
          const value = entry.value;
          return [period, value];
        })
      },
      range: this.period === 'month' ? 'monthly' : 'daily',
      title: this.period === 'month' ? '(Monthly)' : '(Daily)',
      label: this.selected === 'downloads' ? 'Downloads' : 'Page Views',
    });

    if (this.isLastPage()) {
      this.$next.style.display = 'none';
    } else {
      this.$next.style.display = 'block';
    }

    if (this.isFirstPage()) {
      this.$prev.style.display = 'none';
    } else {
      this.$prev.style.display = 'block';
    }

    this.log('Rendering view', $el, data);
  }

  loadMore() {
    const currentMetric = this.getSelectedMetric();
    if (currentMetric.remaining < 1) {
      this.log('No more pages, skipping');
      return null;
    }

    if (this.isLocked) {
      console.warn('Request already in progress');
      this.lock = this.lock.then(function () {
        this.loadMore();
      }.bind(this));
      return this.lock;
    }

    const deferred = utils.defer();
    this.isLocked = true;
    this.lock = deferred.promise;
    const page = currentMetric.page + 1;
    const perView = this.period === 'day' ? 30 : 12;

    // The next XHR
    this.currentRrequest = utils.getJson(
        this.getEndpoint(
            this.endpoint,
            this.type,
            this.id,
            this.selected,
            this.period,
            perView,
            page
        )
    );

    return this.currentRrequest
        .then(j => JSON.parse(j))
        .then(json => {
          this.total = json.totalPeriods || 0;
          this.log('parse page ', page);
          const remaining = this.total - (perView * page);
          const remainingPages = Math.ceil(remaining / perView);
          this.saveResults(json, page, remainingPages);
          this.isLocked = false;
          deferred.resolve();
          this.log('resolved,', 'total', this.total, 'remaining requests:', remainingPages);
          return json;
        });
  }
}

module.exports = Metrics;
