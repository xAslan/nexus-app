import { Skeleton, Input, List, Button, Row, Col, Card } from "antd"
import * as styled from "app/users/components/styles"
import { useAggregates } from "app/users/components/dashboardCtx"

const BanksList = (props) => {
  const { holdings } = useAggregates()

  const renderList = (holdings = []) => {
    console.log(holdings)
    return (
      <styled.AccountsCard title="Accounts" bordered={false}>
        <List
          itemLayout="horizontal"
          dataSource={holdings}
          renderItem={({ institution, fiatAmount, amount, asset }) => (
            <Skeleton loading={holdings.length > 0 ? false : true} active avatar>
              <List.Item>
                <styled.BanksList>
                  <div>
                    <strong> {institution.name} </strong>
                    <strong>
                      {" "}
                      $ {fiatAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
                    </strong>
                  </div>

                  <div>
                    <span> {amount.toLocaleString("en-US", { maximumFractionDigits: 2 })} </span>
                    <span> {asset.symbol} </span>
                  </div>
                </styled.BanksList>
              </List.Item>
            </Skeleton>
          )}
        />

        <styled.CenteredButton>
          <Button block> Link Account </Button>
        </styled.CenteredButton>
      </styled.AccountsCard>
    )
  }

  return renderList(holdings)
}

export default BanksList
