'use strict';

const utils = require('../libs/elife-utils')();
const BarChart = require('./BarChart');

class Metrics {

  constructor($el) {
    this.$el = $el;

    const $charts = utils.buildElement('div', ['charts'], '', this.$el);

    const container = utils.buildElement('div', [], 'Loading...', $charts);
    container.id = this.$el.dataset.containerId;
    const p = utils.buildElement('p', [], '', $charts);

    // TODO: not sure who uses this?
    utils.buildElement('span', ['visuallyhidden'], 'Toggle charts', p);

    // TODO: extract
    // The data flows from left to right, but clicking the left arrow takes
    // you to the next page, which is the previous month, the comments below
    // provide the best description of the UI.
    this.$next = this.trigger('prev', 'Left', p); // "->" arrow
    this.$prev = this.trigger('next', 'Right', p); // "<-" arrow

    const $grouping = utils.buildElement(
      'ol',
      ['button-collection', 'button-collection--centered', 'button-collection--compact'],
      '',
      this.$el
    );
    this.$dailyButton = this.groupingButton($grouping, 'Daily');
    this.$monthlyButton = this.groupingButton($grouping, 'Monthly');

    // We need get these from the DOM, I would prefer a script with JSON.
    this.endpoint = $el.dataset.apiEndpoint;
    this.id = $el.dataset.id;
    this.type = $el.dataset.type || 'article';
    this.selected = $el.dataset.metric || 'downloads';
    this.period = $el.dataset.period || 'month';

    const parent = utils.closest(this.$el, '.article-section');
    if (parent) {
      parent.addEventListener('expandsection', () => {
        // This catches cases where the data may be loading, which breaks.
        if (this.getSelectedMetric().page !== 0) {
          this.renderView($el, this.getSelectedMetric());
        }
      });
    }

    // The data flows from left to right, but clicking the left arrow takes
    // you to the next page, which is the previous month, the comments below
    // provide the best description of the UI.
    this.availableCharts = ['page-views', 'downloads'];
    this.availablePeriods = ['day', 'month'];
    this.currentChart = this.availableCharts.indexOf(this.selected);

    // Set the correct button initially.
    if (this.period === 'month') {
      this.$monthlyButton.classList.add('button--default');
      this.$monthlyButton.classList.remove('button--outline');
      this.$dailyButton.classList.add('button--outline');
      this.$dailyButton.classList.remove('button--default');
    } else {
      this.$monthlyButton.classList.add('button--outline');
      this.$monthlyButton.classList.remove('button--default');
      this.$dailyButton.classList.add('button--default');
      this.$dailyButton.classList.remove('button--outline');
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
    this.barChart = new BarChart($el.dataset.containerId);
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
    this.updateSelectedMetric(m => Object.assign(m, { selected: true }));

    // Register event to call this method.
    this.loadMore().then(function () {
      return this.renderView($el, this.getSelectedMetric());
    }.bind(this));
  }

  trigger(temporalDirection, side, p) {
    const a = utils.buildElement('a', ['trigger', 'trigger--' + temporalDirection], this.chevron(side), p);
    a.href = '#';
    return a;
  }

  chevron(side) {
    const svg = 'chevron' + side + 'Svg';
    const srcset = 'chevron' + side + 'Srcset';
    const src = 'chevron' + side + 'Src';
    return '<picture>' +
      '<source srcset="' + this.$el.dataset[svg] + '" type="image/svg+xml">' +
      '<img srcset="' + this.$el.dataset[srcset] +
      '" src="' + this.$el.dataset[src] +
      '" alt="Navigate ' + side.toLowerCase() + ' icon">' +
      '</picture>';
  }

  groupingButton($grouping, label) {
    const $item = utils.buildElement(
      'li',
      [
        'button-collection__item',
      ],
      null,
      $grouping
    );
    const button = utils.buildElement(
      'a',
      [
        'button',
        'button--outline',
        'button--small',
      ],
      label,
      $item
    );
    button.href = '#';
    return button;
  }

  changePeriod(period) {
    return (e) => {
      e.preventDefault();

      // Change button style.
      const $current = this.$el.querySelector('.button--default');
      $current.classList.add('button--outline');
      $current.classList.remove('button--default');

      e.currentTarget.classList.add('button--default');
      e.currentTarget.classList.remove('button--outline');
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

  nextButton(e) {
    e.preventDefault();
    this.$el.classList.add('charts--loading');
    this.loadMore().then(() => {
      this.$el.classList.remove('charts--loading');
      this.updateSelectedMetric(m => Object.assign(m, { viewPage: m.viewPage + 1 }));
      this.renderView(this.$el, this.getSelectedMetric());
    });
  }

  prevButton(e) {
    e.preventDefault();
    this.updateSelectedMetric(m => Object.assign(m, { viewPage: m.viewPage - 1 }));
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

      if (m.periods.length >= 2) {
        if (this.periodToTimestamp(m.periods[0]) < this.periodToTimestamp(m.periods[1])) {
          m.reverse = 1;
        }
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

  log(/* ...args */) {

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
