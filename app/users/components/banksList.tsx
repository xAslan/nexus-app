import { Skeleton, Input, List, Button, Row, Col, Card } from "antd"
import * as styled from "app/users/components/styles"
import { useAggregates } from "app/users/components/dashboardCtx"
import _ from "lodash"

const BanksList = (props) => {
  const { holdings } = useAggregates()

  const renderList = (holdings = []) => {
    const holdingsObjects = _.mapValues(
      _.groupBy(holdings, ({ accountId }) => accountId),
      (arr, keyIdx) => {
        const totalAmount = _.sumBy(arr, (account) => account.fiatAmount)
        return {
          accountId: arr[0]["accountId"],
          totalAmount,
          accountName: arr[0]["institution"]["name"],
        }
      }
    )

    const holdingsArray = Object.entries(holdingsObjects).map((obj) => obj[1])

    console.log(holdings)

    return (
      <styled.AccountsCard title="Accounts" bordered={false}>
        <List
          itemLayout="horizontal"
          dataSource={holdingsArray}
          renderItem={({ accountName, totalAmount, accountId }) => (
            <Skeleton loading={holdings.length > 0 ? false : true} active avatar>
              <List.Item>
                <styled.BanksList>
                  <div>
                    <strong> {accountName} </strong>
                    <strong>
                      {" "}
                      $ {totalAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
                    </strong>
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
