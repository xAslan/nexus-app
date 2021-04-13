import React from "react"
import { Card } from "antd"
import "antd/dist/antd.css"
import { Line } from "react-chartjs-2"

let today = new Date()

let lastYearStart = new Date(today.getFullYear() - 1, 0, 1)
let lastYearEnd = new Date(today.getFullYear(), 0, 1)

let lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1)
let lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth() - 1, 1)

let threeMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1)
let threeMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth() - 3, 1)

let sixMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1)
let sixMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth() - 6, 1)

let lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
let lastWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

const options = {
  tooltips: {
    callbacks: {
      label: function (tooltipItem, data) {
        var dataset = data.datasets[tooltipItem.datasetIndex]
        var currentValue = dataset.data[tooltipItem.index]
        var precentage, previousValue
        if (tooltipItem.index - 1 >= 0) {
          previousValue = dataset.data[tooltipItem.index - 1]
          precentage = parseFloat(((currentValue - previousValue) * 100) / previousValue).toFixed(1)
        } else {
          precentage = 0
        }
        return currentValue + " (" + precentage + "%)"
      },
      title: function (tooltipItem, data) {
        return data.labels[tooltipItem[0].index]
      },
    },
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
        stacked: true,
      },
    ],
  },
  legend: {
    display: false,
  },
}

class LineChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      chartRange: "All",
    }
  }

  handleChange = (e) => {
    this.setState({ chartRange: e.target.value })
  }

  RangeDropdownButtons = (e) => {
    return (
      <select onBlur={this.handleChange}>
        <option value="All">All</option>
        <option value="lastWeek">7 Days</option>
        <option value="lastMonth">1 Month</option>
        <option value="threeMonth">3 Month</option>
        <option value="sixMonth">6 Month</option>
        <option value="lastYear">1 Year</option>
      </select>
    )
  }

  render() {
    this.chartLabelName = []
    let chartLabelInProgress = []

    this.chartData = []
    let chartDataInProgress = []

    // let sortDateFromLowest = this.props.valueOfAccount.sort((a, b) => a.timestamp - b.timestamp);

    for (let i = 0; i < this.props.valueOfAccount.length; i++) {
      var d = new Date(this.props.valueOfAccount[i].timestamp)
      // let dateFromLowest = d.getDay() + ' ' + d.toLocaleString('default', {month: 'long'}) + ' ' + d.getFullYear();

      if (this.state.chartRange === "All") {
        chartLabelInProgress.push(
          d.getDate() +
            " " +
            d.toLocaleString("default", { month: "short" }) +
            " " +
            d.getFullYear()
        )
        chartDataInProgress.push(this.props.valueOfAccount[i].value)

        this.chartLabelName = chartLabelInProgress
        this.chartData = chartDataInProgress
      } else if (
        this.state.chartRange === "lastWeek" &&
        this.props.valueOfAccount[i].timestamp >= lastWeekStart.getTime() &&
        this.props.valueOfAccount[i].timestamp < lastWeekEnd.getTime()
      ) {
        chartLabelInProgress.push(
          d.getDate() +
            " " +
            d.toLocaleString("default", { month: "short" }) +
            " " +
            d.getFullYear()
        )
        chartDataInProgress.push(this.props.valueOfAccount[i].value)

        this.chartLabelName = chartLabelInProgress
        this.chartData = chartDataInProgress
      } else if (
        this.state.chartRange === "lastMonth" &&
        this.props.valueOfAccount[i].timestamp >= lastMonthStart.getTime() &&
        this.props.valueOfAccount[i].timestamp < lastMonthEnd.getTime()
      ) {
        chartLabelInProgress.push(
          d.getDate() +
            " " +
            d.toLocaleString("default", { month: "short" }) +
            " " +
            d.getFullYear()
        )
        chartDataInProgress.push(this.props.valueOfAccount[i].value)

        this.chartLabelName = chartLabelInProgress
        this.chartData = chartDataInProgress
      } else if (
        this.state.chartRange === "threeMonth" &&
        this.props.valueOfAccount[i].timestamp >= threeMonthStart.getTime() &&
        this.props.valueOfAccount[i].timestamp < threeMonthEnd.getTime()
      ) {
        chartLabelInProgress.push(
          d.getDate() +
            " " +
            d.toLocaleString("default", { month: "short" }) +
            " " +
            d.getFullYear()
        )
        chartDataInProgress.push(this.props.valueOfAccount[i].value)

        this.chartLabelName = chartLabelInProgress
        this.chartData = chartDataInProgress
      } else if (
        this.state.chartRange === "sixMonth" &&
        this.props.valueOfAccount[i].timestamp >= sixMonthStart.getTime() &&
        this.props.valueOfAccount[i].timestamp < sixMonthEnd.getTime()
      ) {
        chartLabelInProgress.push(
          d.getDate() +
            " " +
            d.toLocaleString("default", { month: "short" }) +
            " " +
            d.getFullYear()
        )
        chartDataInProgress.push(this.props.valueOfAccount[i].value)

        this.chartLabelName = chartLabelInProgress
        this.chartData = chartDataInProgress
      } else if (
        this.state.chartRange === "lastYear" &&
        this.props.valueOfAccount[i].timestamp >= lastYearStart.getTime() &&
        this.props.valueOfAccount[i].timestamp < lastYearEnd.getTime()
      ) {
        chartLabelInProgress.push(
          d.getDate() +
            " " +
            d.toLocaleString("default", { month: "short" }) +
            " " +
            d.getFullYear()
        )
        chartDataInProgress.push(this.props.valueOfAccount[i].value)

        this.chartLabelName = chartLabelInProgress
        this.chartData = chartDataInProgress
      }
    }

    this.data = (canvas) => {
      const ctx = canvas.getContext("2d")
      const gradient = ctx.createLinearGradient(0, 0, 0, 400)
      gradient.addColorStop(0, "rgba(62, 222, 134, 0.8)")
      gradient.addColorStop(1, "rgba(162, 219, 187, 0.35)")

      return {
        labels: this.chartLabelName,
        datasets: [
          {
            label: "Amount",
            data: this.chartData,
            fill: true,
            backgroundColor: gradient,
            borderColor: gradient,
          },
        ],
      }
    }

    return (
      <Card title={this.props.title} extra={this.RangeDropdownButtons()}>
        <Line data={this.data} options={options} />
      </Card>
    )
  }
}

export default LineChart
