import { Progress } from "antd"
import * as styled from "app/users/components/styles"

const cashFlowData = [
  {
    description: "Income Last Month",
    amount: 5000,
    percent: 60,
    status: "normal",
  },
  {
    description: "Expense Last Month",
    amount: 3000,
    percent: 30,
    status: "exception",
  },
  {
    description: "Expense this Month",
    amount: 900,
    percent: 70,
    status: "success",
  },
  {
    description: "Transfer Last Month",
    amount: 8000,
    percent: 80,
    status: "normal",
  },
]

const CashFlow = () => {
  const renderCashFlow = (data) => {
    return data.map(({ amount, percent, description, status }, idx) => (
      <li key={idx}>
        <p>
          {" "}
          <span>{description}</span> <span> ${amount} </span>{" "}
        </p>
        <Progress status={status} percent={percent} format={(percent) => ``} />
      </li>
    ))
  }

  return (
    <styled.CashFlowCard
      title={
        <header>
          <strong>Cash Flow</strong>
          <a> View Full Report </a>
        </header>
      }
    >
      <ul>{renderCashFlow(cashFlowData)}</ul>
    </styled.CashFlowCard>
  )
}

export default CashFlow
