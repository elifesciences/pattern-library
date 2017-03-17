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
    this.period = $el.getAttribute('data-period') || 'month';
    this.$dailyButton = $el.querySelector('[data-target="daily"]');
    this.$monthlyButton = $el.querySelector('[data-target="monthly"]');

    // The data flows from left to right, but clicking the left arrow takes
    // you to the next page, which is the previous month, the comments below
    // provide the best description of the UI.
    this.$prev = $el.querySelector('.trigger--next'); // "->" arrow
    this.$next = $el.querySelector('.trigger--prev'); // "<-" arrow
    this.availableCharts = ['page-views', 'downloads'];
    this.availablePeriods = ['day', 'month'];
    this.currentChart = this.availableCharts.indexOf(this.selected);

    // Set the correct button initially.
    if (this.period === 'month') {
      this.$monthlyButton.classList.add('button-collection__button--active');
      this.$dailyButton.classList.remove('button-collection__button--active');
    } else {
      this.$monthlyButton.classList.remove('button-collection__button--active');
      this.$dailyButton.classList.add('button-collection__button--active');
    }

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
      viewPage: 1,
      firstMonth: null,
      remaining: 1,
      periods: [],
      selected: false,
      loaded: false,
      reverse: -1
    }));

    // data-daily-id
    this.$prev.addEventListener('click', this.prevButton.bind(this));
    this.$next.addEventListener('click', this.nextButton.bind(this));
    if (this.$dailyButton) {
      this.$dailyButton.addEventListener('click', this.changePeriod('day').bind(this));
    }

    if (this.$monthlyButton) {
      this.$monthlyButton.addEventListener('click', this.changePeriod('month').bind(this));
    }

    // Select the current metric.
    this.updateSelectedMetric(m => utils.extend(m, { selected: true }));

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
      return this.changeMetric(
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

  nextButton() {
    this.$el.classList.add('charts--loading');
    this.loadMore().then(() => {
      this.$el.classList.remove('charts--loading');
      this.updateSelectedMetric(m => utils.extend(m, { viewPage: m.viewPage + 1 }));
      this.renderView(this.$el, this.getSelectedMetric());
    });
  }

  prevButton() {
    this.updateSelectedMetric(m => utils.extend(m, { viewPage: m.viewPage - 1 }));
    this.renderView(this.$el, this.getSelectedMetric());
  }

  nextChart() {
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

  previousChart() {
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

  changeMetric(metric, period) {
    this.$el.classList.add('charts--loading');
    if (this.isLocked) {
      this.log('Finishing in progress requests first');
      return this.lock.then(() => this.changeMetric(metric, period));
    }

    // Select the current metric.
    this.updateSelectedMetric(function (m) {
      return utils.extend(m, { selected: false });
    });

    this.selected = metric;
    this.period = period;
    let isLoaded;

    // Select the current metric.
    this.updateSelectedMetric(function (m) {
      isLoaded = m.loaded;
      return utils.extend(m, { selected: true });
    });

    this.log('Changed metric to ', metric, period, ', loaded: ', isLoaded);
    return Promise.resolve(isLoaded ? null : this.loadMore());
  }

  getSelectedName() {
    this.log('selected name: ', `${this.selected}-by-${this.period}`);
    return `${this.selected}-by-${this.period}`;
  }

  getEndpoint(url, type, id, metric, by, perPage, page) {
    return `${url}/metrics/${type}/${id}/${metric}?by=${by}&per-page=${perPage}&page=${page}`;
  }

  getSelectedMetric() {
    for (const metric of this.metrics) {
      if (metric.name === this.getSelectedName()) {
        return metric;
      }

    }

  }

  getNthPage(n, firstMonth, firstMonthYear, direction) {
    let month = firstMonth;
    let year = firstMonthYear;

    month = month + ((n - 1) * direction);
    while (month > 12) {
      month = month - 12;
      year += 1;
    }

    return { month: parseInt(month, 10), year: parseInt(year, 10) };
  }

  getJsonPage(page, perView) {
    return utils.loadData(
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
  }

  updateSelectedMetric(fn) {
    this.metrics = this.metrics.map(m => m.name === this.getSelectedName() ? fn(m) : m);
  }

  saveResults(data, page, remaining) {
    this.log('saving results', data);

    // Add the results to the metrics store.
    this.updateSelectedMetric(function (m) {
      m.periods = m.periods.concat(this.transformPeriods(data.periods));
      m.page = page;
      m.loaded = true;
      m.remaining = remaining;
      if (page === 1) {
        m.firstMonth = [parseInt(m.periods[0].month), parseInt(m.periods[0].year)];
      }

      if (this.periodToTimestamp(m.periods[0]) < this.periodToTimestamp(m.periods[1])) {
        m.reverse = 1;
      }

      return m;
    }.bind(this));
  }

  periodToTimestamp(entry) {
    return Date.UTC(
        parseInt(entry.year, 10),
        parseInt(entry.month - 1, 10),
        parseInt(entry.day ? entry.day : 1, 10)
    );
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

  filterPeriod(month, year) {
    return (d) => parseInt(d.month, 10) === month && parseInt(d.year, 10) === year;
  }

  filterYearPeriod(year) {
    return (d) => parseInt(d.year, 10) === year;
  }

  filterMonthPeriod(firstMonth, firstMonthYear, viewPage) {
    return (d) => {
      if (
          parseInt(d.month, 10) >= firstMonth &&
          parseInt(d.year, 10) === firstMonthYear + (viewPage - 1)
      ) {
        return true;
      }

      return (
          parseInt(d.month, 10) <= firstMonth &&
          parseInt(d.year, 10) === firstMonthYear + viewPage
      );
    };
  }

  renderView($el, data) {
    let periods;
    let hasNextPage;

    const [firstMonth, firstMonthYear] = data.firstMonth;

    const current = this.getNthPage(data.viewPage, firstMonth, firstMonthYear, data.reverse);
    const next = this.getNthPage(data.viewPage + 1, firstMonth, firstMonthYear, data.reverse);

    // Current page of results.
    const currentFilter = (
        this.period === 'day' ?
            this.filterPeriod(current.month, current.year) :
            this.filterYearPeriod(firstMonthYear + ((data.viewPage - 1) * data.reverse))
    );

    // Next page of results.
    const nextFilter = (
        this.period === 'day' ?
            this.filterPeriod(next.month, next.year) :
            this.filterYearPeriod(firstMonthYear + (data.viewPage * data.reverse))
    );

    // Filter by each.
    periods = data.periods.filter(currentFilter);
    hasNextPage = data.periods.filter(nextFilter).length > 0;

    // Reverse if needed.
    if (data.reverse === -1) {
      periods = periods.reverse();
    }

    // Start working on UI.
    this.$el.classList.remove('charts--loading');
    this.barChart.updateFromJson({
      data: {
        totalPeriods: data.totalPeriods,
        totalValue: data.totalValue,
        periods: periods.map((entry) => [
          this.periodToTimestamp(entry),
          entry.value
        ])
      },
      range: this.period === 'month' ? 'monthly' : 'daily',
      title: this.period === 'month' ? '(Monthly)' : '(Daily)',
      label: this.selected === 'downloads' ? 'Downloads' : 'Page Views',
    });

    if (!hasNextPage) {
      this.$next.classList.add('hidden');
    } else {
      this.$next.classList.remove('hidden');
    }

    if (data.viewPage === 1) {
      this.$prev.classList.add('hidden');
    } else {
      this.$prev.classList.remove('hidden');
    }

    this.log('Rendering view', $el, data);
  }

  loadMore() {
    const currentMetric = this.getSelectedMetric();
    if (currentMetric.remaining < 1) {
      this.log('No more pages, skipping');
      return Promise.resolve(null);
    }

    if (this.isLocked) {
      this.log('Request already in progress');
      this.lock = this.lock.then(function () {
        this.loadMore();
      }.bind(this));
      return this.lock;
    }

    const deferred = utils.defer();
    this.isLocked = true;
    this.lock = deferred.promise;
    const page = currentMetric.page + 1;

    // Over fetch so we know that there is a next month to load.
    const perView = this.period === 'day' ? 32 : 13;

    // The next XHR
    this.currentRrequest = this.getJsonPage(page, perView);

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
