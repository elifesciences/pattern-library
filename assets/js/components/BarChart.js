'use strict';

const Highcharts = require('highcharts');

const MONTHLY_TICK = 3600 * 1000 * 24 * 30;
const DAILY_TICK = 3600 * 1000 * 24 * 7;

const defaultOptions = {
  chart: { type: 'column' },
  credits: { enabled: false },
  title: { text: 'Downloads', },
  subtitle: { text: '(Monthly)', },
  exporting: false,
  xAxis: {
    type: 'datetime',
    dateTimeLabelFormats: { month: '%m/%y' },
    tickInterval: MONTHLY_TICK,
    gridLineWidth: 1,
    labels: {
      style: { fontWeight: 'bold' },
    }
  },
  yAxis: {
    min: 0,
    title: { text: null },
    labels: {
      step: 2,
      style: { fontWeight: 'bold' }
    },
    plotLines: [
      {
        value: 0,
        width: 1,
        color: '#808080'
      }
    ]
  },
  legend: { enabled: false },
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
                ${this.y} ${this.points[0].series.chart.options.title.text}
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
        hover: { color: '#0088cd' }
      }
    }
  },
  series: [{
    name: null,
    data: [],
    color: '#000000',
    lineColor: '#cccccc'
  }]
};

class BarChart {

  constructor(id) {
    this.target = id;
    this.chart = Highcharts.chart(id, defaultOptions);
  }

  update(data, dateTimeLabelFormats, tickInterval, text, label) {
    const config = {
      title: { text: label },
      subtitle: { text, },
      xAxis: { tickInterval, dateTimeLabelFormats, },
      series: [{
        name: null,
        data: data.periods
      }]
    };

    this.chart.update(config);
  }

  getDateRange(range) {
    return {
      dateRange: {
        [range === 'monthly' ? 'week' : 'day']: '%d/%m/%y'
      },
      tick: range === 'monthly' ? MONTHLY_TICK : DAILY_TICK
    };
  }

  updateFromJson({ data, label, range, title }) {
    const { dateRange, tick } = this.getDateRange(range);

    this.update(
        data,
        dateRange,
        tick,
        title,
        label
    );
  }
}

module.exports = BarChart;
