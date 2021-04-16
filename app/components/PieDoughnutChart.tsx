import { Doughnut, Pie } from "react-chartjs-2"
import { Card } from "antd"
import { useAggregates } from "app/users/components/dashboardCtx"
import _ from "lodash"

var options = {
  tooltips: {
    callbacks: {
      label: (tooltipItem, data) => {
        const dataset = data.datasets[tooltipItem.datasetIndex]
        const meta = dataset._meta[Object.keys(dataset._meta)[0]]
        const total = meta.total
        const currentValue = dataset.data[tooltipItem.index]
        const percentage = parseFloat(((currentValue / total) * 100).toFixed(1))
        return (
          currentValue.toLocaleString("en-US", { maximumFractionDigits: 2 }) +
          " (" +
          percentage +
          "%)"
        )
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

const getChartData = (holdingsAgg = []) => {
  if (holdingsAgg.length <= 5) {
    const sortedCryptoCoin = holdingsAgg.sort((a, b) => b["fiatAmount"] - a["fiatAmount"])

    return _.map(sortedCryptoCoin, (holding) => ({
      chartLabel: holding?.asset?.name! || holding.label,
      chartProgress: holding.fiatAmount,
    }))
  } else if (holdingsAgg.length >= 6) {
    let sortedCryptoCoin = holdingsAgg.sort((a, b) => b["fiatAmount"] - a["fiatAmount"])

    return _.reduce(
      sortedCryptoCoin,
      (acc, holding, idx) => {
        if (idx <= 3) {
          return acc.concat({
            chartLabel: holding.asset.name,
            chartProgress: holding.fiatAmount,
          })
        }

        if (typeof acc[4] === "undefined") {
          return acc.concat({
            chartLabel: "OTHER",
            chartProgress: holding.fiatAmount,
          })
        } else {
          const sum = {
            chartLabel: "OTHER",
            chartProgress: acc[4]["chartProgress"] + holding.fiatAmount,
          }

          return _.uniqBy([sum, ...acc], ({ chartLabel }) => chartLabel)
        }
      },
      []
    )
  }
}

export const PieDoughnutChart = (props) => {
  const { holdings } = useAggregates()

  const renderPieChart = (holdings = [], type = "Not a Pie") => {
    const uniqHoldings = _.reduce(
      holdings,
      (acc, curr) => {
        const idx = _.findIndex(acc, (obj) => obj.assetId === curr.assetId)
        if (idx >= 0) {
          const sumFiat = curr.fiatAmount + acc[idx]["fiatAmount"]
          const sumCoin = curr.amount + acc[idx]["amount"]

          const newHoldingsArray = [
            ...acc,
            {
              ...curr,
              amount: sumCoin,
              fiatAmount: sumFiat,
            },
          ]

          return _.uniqBy(_.reverse(newHoldingsArray), ({ assetId }) => assetId)
        }

        return acc.concat(curr)
      },
      []
    )

    const chartData = getChartData(uniqHoldings)

    const chartLabels = _.map(chartData, (holding) => holding.chartLabel)
    const chartAmounts = _.map(chartData, (holding) => holding.chartProgress)

    const data = {
      labels: chartLabels,
      datasets: [
        {
          data: chartAmounts,
          backgroundColor: ["#34A370", "#FFB129", "#3EDE86", "#154A39", "#FF6565"],
          hoverBackgroundColor: ["#34A370", "#FFB129", "#3EDE86", "#154A39", "#FF6565"],
        },
      ],
    }

    if (type === "Pie") {
      return <Pie data={data} options={options} height={300} />
    }

    return <Doughnut data={data} options={options} height={300} />
  }

  if (typeof props.filter !== "undefined") {
    const filteredHoldings = _.filter(holdings, props.filter)

    return <Card title={props.title}>{renderPieChart(filteredHoldings, props.type)}</Card>
  }

  return <Card title={props.title}>{renderPieChart(holdings, props.type)}</Card>
}

export const DiffPieChart = (props) => {
  const { holdings } = useAggregates()

  const renderPieChart = (holdings = [], type = "Not a Pie") => {
    const uniqHoldings = _.reduce(
      holdings,
      (acc, curr) => {
        const idx = _.findIndex(acc, ({ label }) => label === curr.asset.type)

        if (idx >= 0) {
          const sumAmount = curr.fiatAmount + acc[idx]["fiatAmount"]

          const newHoldingsArray = [
            ...acc,
            {
              label: curr.asset.type,
              fiatAmount: sumAmount,
            },
          ]

          return _.uniqBy(_.reverse(newHoldingsArray), ({ label }) => label)
        }

        return acc.concat({
          label: curr.asset.type,
          fiatAmount: curr.fiatAmount,
        })
      },
      []
    )

    const chartData = getChartData(uniqHoldings)

    const chartLabels = _.map(chartData, (holding) => holding.chartLabel)
    const chartAmounts = _.map(chartData, (holding) => holding.chartProgress)

    const data = {
      labels: chartLabels,
      datasets: [
        {
          data: chartAmounts,
          backgroundColor: ["#34A370", "#FFB129", "#3EDE86", "#154A39", "#FF6565"],
          hoverBackgroundColor: ["#34A370", "#FFB129", "#3EDE86", "#154A39", "#FF6565"],
        },
      ],
    }

    if (type === "Pie") {
      return <Pie data={data} options={options} height={300} />
    }

    return <Doughnut data={data} options={options} height={300} />
  }

  return <Card title={props.title}>{renderPieChart(holdings, props.type)}</Card>
}
