import { useState, useEffect } from "react"
import { Card } from "antd"
import { Line } from "react-chartjs-2"
import _ from "lodash"

const today = new Date()

const lastYearStart = new Date(today.getFullYear() - 1, 0, 1)
const lastYearEnd = new Date(today.getFullYear(), 0, 1)

const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1)
const lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth() - 1, 1)

const threeMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1)
const threeMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth() - 3, 1)

const sixMonthEnd = new Date(today.getFullYear(), today.getMonth(), 1)
const sixMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth() - 6, 1)

const lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6)
const lastWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)

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

const LineChart = (props) => {
  const [chartRange, setChartRange] = useState("All")
  const [chartLabel, setChartLabel] = useState([])
  const [chartData, setChartData] = useState([])
  const handleDropDownChange = ({ target }) => setChartRange(target.value)

  const rangeDropdownButtons = (e) => {
    return (
      <select onBlur={(e) => handleDropDownChange(e)}>
        <option value="All">All</option>
        <option value="lastWeek">7 Days</option>
        <option value="lastMonth">1 Month</option>
        <option value="threeMonth">3 Month</option>
        <option value="sixMonth">6 Month</option>
        <option value="lastYear">1 Year</option>
      </select>
    )
  }

  const getChartData = (accountBalance) => {
    return _.reduce(
      accountBalance,
      (acc, currentAccount, Idx) => {
        const d = new Date(currentAccount.timestamp)
        // let dateFromLowest = d.getDay() + ' ' + d.toLocaleString('default', {month: 'long'}) + ' ' + d.getFullYear();

        if (chartRange === "All") {
          return acc.concat({
            chartData: currentAccount.value,
            chartLabel: `${d.getDate()} ${d.toLocaleString("default", {
              month: "short",
            })} ${d.getFullYear()}`,
          })
        } else if (
          chartRange === "lastWeek" &&
          currentAccount.timestamp >= lastWeekStart.getTime() &&
          currentAccount.timestamp < lastWeekEnd.getTime()
        ) {
          return acc.concat({
            chartData: currentAccount.value,
            chartLabel: `${d.getDate()} ${d.toLocaleString("default", {
              month: "short",
            })} ${d.getFullYear()}`,
          })
        } else if (
          chartRange === "lastMonth" &&
          currentAccount.timestamp >= lastMonthStart.getTime() &&
          currentAccount.timestamp < lastMonthEnd.getTime()
        ) {
          return acc.concat({
            chartData: currentAccount.value,
            chartLabel: `${d.getDate()} ${d.toLocaleString("default", {
              month: "short",
            })} ${d.getFullYear()}`,
          })
        } else if (
          chartRange === "threeMonth" &&
          currentAccount.timestamp >= threeMonthStart.getTime() &&
          currentAccount.timestamp < threeMonthEnd.getTime()
        ) {
          return acc.concat({
            chartData: currentAccount.value,
            chartLabel: `${d.getDate()} ${d.toLocaleString("default", {
              month: "short",
            })} ${d.getFullYear()}`,
          })
        } else if (
          chartRange === "sixMonth" &&
          currentAccount.timestamp >= sixMonthStart.getTime() &&
          currentAccount.timestamp < sixMonthEnd.getTime()
        ) {
          return acc.concat({
            chartData: currentAccount.value,
            chartLabel: `${d.getDate()} ${d.toLocaleString("default", {
              month: "short",
            })} ${d.getFullYear()}`,
          })
        } else if (
          chartRange === "lastYear" &&
          currentAccount.timestamp >= lastYearStart.getTime() &&
          currentAccount.timestamp < lastYearEnd.getTime()
        ) {
          return acc.concat({
            chartData: currentAccount.value,
            chartLabel: `${d.getDate()} ${d.toLocaleString("default", {
              month: "short",
            })} ${d.getFullYear()}`,
          })
        }
        return acc
      },
      []
    )
  }

  useEffect(() => {
    const chartDataArr = getChartData(props.valueOfAccount)
    const chartLabel = _.flatMap(chartDataArr, ({ chartLabel, chartData }) => chartLabel)
    const chartData = _.flatMap(chartDataArr, ({ chartLabel, chartData }) => chartData)

    setChartData(chartData)
    setChartLabel(chartLabel)
  }, [props.valueOfAccount, chartRange])

  const data = (canvas) => {
    const ctx = canvas.getContext("2d")
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, "rgba(62, 222, 134, 0.8)")
    gradient.addColorStop(1, "rgba(162, 219, 187, 0.35)")

    return {
      labels: chartLabel,
      datasets: [
        {
          label: "Amount",
          data: chartData,
          fill: true,
          backgroundColor: gradient,
          borderColor: gradient,
        },
      ],
    }
  }

  return (
    <Card title={props.title} extra={rangeDropdownButtons()}>
      <Line data={data} options={options} />
    </Card>
  )
}

export default LineChart
