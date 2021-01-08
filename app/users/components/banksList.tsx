import { Input, List, Button, Row, Col, Card } from "antd"
import * as styled from "app/users/components/styles"

const banksList = [
  {
    bankName: "Ally Bank",
    savingsUSD: 5000.0,
    savingsGBP: 3400.04,
    text: "Interest Checking-Earning in 2020",
  },
  {
    bankName: "Chase Bank",
    savingsUSD: 0.0,
    savingsGBP: 0.0,
    text: "Interest Checking-Earning in 2020",
  },
  {
    bankName: "Ally Bank",
    savingsUSD: 2500.0,
    savingsGBP: 2403.04,
    text: "Interest Checking-Earning in 2020",
  },
  {
    bankName: "Binance Bank",
    savingsUSD: 2500,
    savingsGBP: 2043.05,
    text: "Interest Checking-Earning in 2020",
  },
]

const BanksList = () => {
  return (
    <styled.AccountsCard title="Accounts" bordered={false}>
      <List
        itemLayout="horizontal"
        dataSource={banksList}
        renderItem={({ bankName, savingsUSD, savingsGBP, text }) => (
          <List.Item>
            <styled.BanksList>
              <div>
                <strong> {bankName} </strong>
                <strong> ${savingsUSD} </strong>
              </div>

              <div>
                <span> {text} </span>
                <span> {savingsGBP} </span>
              </div>
            </styled.BanksList>
          </List.Item>
        )}
      />

      <styled.CenteredButton>
        <Button block> Link Account </Button>
      </styled.CenteredButton>
    </styled.AccountsCard>
  )
}

export default BanksList
