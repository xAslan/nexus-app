import React from "react"
import { Doughnut, Pie } from "react-chartjs-2"
import { Card } from "antd"
import "antd/dist/antd.css"

var options = {
  tooltips: {
    callbacks: {
      label: function (tooltipItem, data) {
        var dataset = data.datasets[tooltipItem.datasetIndex]
        var meta = dataset._meta[Object.keys(dataset._meta)[0]]
        var total = meta.total
        var currentValue = dataset.data[tooltipItem.index]
        var percentage = parseFloat(((currentValue / total) * 100).toFixed(1))
        return currentValue + " (" + percentage + "%)"
      },
      title: function (tooltipItem, data) {
        return data.labels[tooltipItem[0].index]
      },
    },
  },
  legend: {
    labels: {
      boxWidth: 15,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
}

class PieDoughnutChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    this.chartLabelName = []
    let chartLabelInProgress = []

    this.chartData = []
    let chartDataInProgress = []

    let otherCategoryDollarAmount = []

    if (this.props.cryptoCoin.length <= 5) {
      let sortedCryptoCoin = this.props.cryptoCoin.sort(
        (a, b) => b.primaryCurrencyAmount - a.primaryCurrencyAmount
      )
      for (let i = 0; i < sortedCryptoCoin.length; i++) {
        chartLabelInProgress.push(sortedCryptoCoin[i].name)
        chartDataInProgress.push(sortedCryptoCoin[i].primaryCurrencyAmount)
      }

      this.chartLabelName = chartLabelInProgress
      this.chartData = chartDataInProgress
    } else if (this.props.cryptoCoin.length >= 6) {
      let sortedCryptoCoin = this.props.cryptoCoin.sort(
        (a, b) => b.primaryCurrencyAmount - a.primaryCurrencyAmount
      )
      for (let i = 0; i < sortedCryptoCoin.length; i++) {
        if (i <= 3) {
          chartLabelInProgress.push(sortedCryptoCoin[i].name)
          chartDataInProgress.push(sortedCryptoCoin[i].primaryCurrencyAmount)
        } else if (i >= 4) {
          otherCategoryDollarAmount.push(sortedCryptoCoin[i].primaryCurrencyAmount)
        }
      }

      const reducer = (accumulator, currentValue) => accumulator + currentValue // calculates otherCategoryDollarAmount values
      chartLabelInProgress.push("OTHER")
      chartDataInProgress.push(otherCategoryDollarAmount.reduce(reducer))

      this.chartLabelName = chartLabelInProgress
      this.chartData = chartDataInProgress
    }

    let data = {
      labels: this.chartLabelName,
      datasets: [
        {
          data: this.chartData,
          backgroundColor: ["#34A370", "#FFB129", "#3EDE86", "#154A39", "#FF6565"],
          hoverBackgroundColor: ["#34A370", "#FFB129", "#3EDE86", "#154A39", "#FF6565"],
        },
      ],
    }

    return (
      <Card title={this.props.title}>
        {this.props.type === "Pie" ? (
          <Pie data={data} options={options} height={300} />
        ) : (
          <Doughnut data={data} options={options} height={300} />
        )}
      </Card>
    )
  }
}

export default PieDoughnutChart
