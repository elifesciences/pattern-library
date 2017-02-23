'use strict';

const Highcharts = require('highcharts');

module.exports = class BarCharts {

  constructor($elm, doc = document) {

    if (!($elm instanceof HTMLElement)) {
      return;
    }

    this.$elm = $elm;
    this.doc = doc;

    this.position = 'monthly';
    this.section = 'downloads';

    this.renderChart();

    this.triggerPrev = document.querySelector('#trigger-prev');
    this.triggerNext = document.querySelector('#trigger-next');

    this.triggerDaily = document.querySelector('#trigger-daily');
    this.triggerMonthly = document.querySelector('#trigger-monthly');

    this.triggerPrev.addEventListener('click', () => this.triggeredPrev());
    this.triggerNext.addEventListener('click', () => this.triggeredNext());

    this.triggerDaily.addEventListener('click', () => this.triggeredDaily());
    this.triggerMonthly.addEventListener('click', () => this.triggeredMonthly());
  }

  getChartData(timeframe, chart) {
    // Parse JSON.
    var el = JSON.parse(document.getElementById(timeframe + chart + 'data').innerText);

    const chartData = el.periods.map((entry) => {

      const period = Date.UTC(entry.year, entry.month, entry.day);
      const value = entry.value;

      return [
        period,
        value
      ];
    });

    return chartData;

  }

  renderChart() {

    this.barchart = Highcharts.chart('highcharts-container', {
      chart: {
        type: 'column'
      },
      credits: {
        enabled: false
      },
      title: {
        text: 'Downloads',
      },
      subtitle: {
        text: '(Monthly)',
      },
      exporting: false,
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          month: '%m/%y'
        },
        tickInterval: 3600 * 1000 * 24 * 30,
        gridLineWidth: 1,
        labels: {
          style: {
            fontWeight: 'bold'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: null
        },

        labels: {
          step: 2,
          style: {
            fontWeight: 'bold'
          }
        },

        plotLines: [{
          value: 0,
          width: 1,
          color: '#808080'
        }]
      },
      legend: {
        enabled: false
      },

      tooltip: {
        shared: true,
        crosshairs: true,
        backgroundColor: '#000000',
        borderColor: '#000000',
        borderRadius: 5,
        useHTML: true,
        formatter: function () {
          return `
            <div class="chart-tooltip">
              <div class="chart-tooltip__header">
                ${this.y} Page views
              </div>
              <div class="chart-tooltip__content">
                ${Highcharts.dateFormat('%b %d, %Y', new Date(this.x))}
              </div>
            </div>
          `;
        }
      },
      plotOptions: {
        column: {
          states: {
            hover: {
              color: '#0088cd'
            }
          }
        }
      },
      series: [{
        name: null,
        data: this.getChartData('monthly', 'bar'),
        color: '#000000',
        lineColor: '#cccccc'
      }]
    });

    return this.barchart;
  }

  update(data, dateTimeLabelFormats, tickInterval, text, isPageViews) {
    const config = {
      subtitle: {
        text
      },
      xAxis: {
        tickInterval,
        dateTimeLabelFormats,
      },
      series: [{
        data
      }]
    };

    if (isPageViews) {
      config.title = {
        text: 'Page views'
      };
    } else {
      config.title = {
        text: 'Downloads'
      };
    }

    this.barchart.update(config);
  }

  static getDateRange(range) {
    if (range === 'monthly') {
      // Monthly view.
      return {
        dateRange: { week: '%d/%m/%y' },
        tick: 3600 * 1000 * 24 * 30
      };
    }

    // Daily view.
    return {
      dateRange: { day: '%d/%m/%y' },
      tick: 3600 * 1000 * 24 * 7
    };
  }

  updateFromJson({ data, type, range, title }) {
    const { dateRange, tick } = this.getDateRange(range);

    this.update(
        data,
        dateRange,
        tick,
        title,
        type === 'Page views'
    );
  }

  triggeredDaily() {
    this.triggerDaily.classList.add('button-collection__button--active');
    this.triggerMonthly.classList.remove('button-collection__button--active');

    if (this.section === 'downloads') {
      this.renderDownloadsDaily(); // 1
    } else {
      this.renderPageViewsDaily();
    }
  }

  triggeredMonthly() {
    this.triggerMonthly.classList.add('button-collection__button--active');
    this.triggerDaily.classList.remove('button-collection__button--active');

    if (this.section === 'downloads') {
      this.renderDownloadsMonthly(); // 1
    } else {
      this.renderPageViewsMonthly();
    }
  }

  triggeredPrev() {
    this.renderPageViewsMonthly();
  }

  triggeredNext() {
    this.renderDownloadsMonthly();
  }

  renderDownloadsMonthly() {
    this.updateFromJson({
      data: this.getChartData('monthly', 'bar'),
      range: 'monthly',
      title: '(Monthly)',
      type: 'Downloads'
    });

    this.position = 'monthly';
    this.section = 'downloads';
  }

  renderDownloadsDaily() {
    this.updateFromJson({
      data: this.getChartData('daily', 'bar'),
      range: 'daily',
      title: '(Daily)',
      type: 'Downloads'
    });

    this.position = 'daily';
    this.section = 'downloads';
  }

  renderPageViewsMonthly() {
    this.updateFromJson({
      data: this.getChartData('monthly', 'line'),
      range: 'monthly',
      title: '(Monthly)',
      type: 'Page views'

    });

    this.position = 'monthly';
    this.section = 'pageviews';
  }

  renderPageViewsDaily() {

    this.updateFromJson({
      data: this.getChartData('daily', 'line'),
      range: 'daily',
      title: '(Daily)',
      type: 'Page views'
    });

    this.position = 'daily';
    this.section = 'pageviews';
  }

};
