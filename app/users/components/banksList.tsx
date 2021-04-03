import { Input, List, Button, Row, Col, Card } from "antd"
import * as styled from "app/users/components/styles"
import { useAggregates } from "app/users/components/dashboardCtx"

const BanksList = (props) => {
  const { holdings } = useAggregates()

  return (
    <styled.AccountsCard title="Accounts" bordered={false}>
      <List
        itemLayout="horizontal"
        dataSource={holdings}
        loading={holdings.length < 0 ? true : false}
        renderItem={({ institution, fiatAmount, amount, asset }) => (
          <List.Item>
            <styled.BanksList>
              <div>
                <strong> {institution.name} </strong>
                <strong> ${fiatAmount} </strong>
              </div>

              <div>
                <span> {amount} </span>
                <span> {asset.symbol} </span>
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
