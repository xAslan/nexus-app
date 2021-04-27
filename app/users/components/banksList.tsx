import { useRouter } from "blitz"
import { Skeleton, Input, List, Button, Row, Col, Card } from "antd"
import * as styled from "app/users/components/styles"
import { useAggregates } from "app/users/components/dashboardCtx"
import _ from "lodash"

interface banksListProps {
  title?: string
  hasButton?: boolean
  renderAssets?: boolean
}

const BanksList = (props: banksListProps) => {
  const { holdings } = useAggregates()
  const router = useRouter()

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

    const renderMultiple = (holdingsArray = [], renderAssets = false, holdings = []) => {
      if (renderAssets) {
        return (
          <List
            itemLayout="horizontal"
            dataSource={holdings}
            renderItem={({ asset, fiatAmount, amount }) => (
              <Skeleton loading={holdings.length > 0 ? false : true} active avatar>
                <List.Item
                  onClick={() =>
                    typeof accountId !== "undefined" && router.push(`/accounts/${accountId}`)
                  }
                >
                  <styled.BanksList>
                    <div>
                      <strong>
                        {" "}
                        {amount} {asset.symbol}{" "}
                      </strong>
                      <strong>
                        {" "}
                        $ {fiatAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
                      </strong>
                    </div>
                  </styled.BanksList>
                </List.Item>
              </Skeleton>
            )}
          />
        )
      }

      return (
        <List
          itemLayout="horizontal"
          dataSource={holdingsArray}
          renderItem={({ accountName, totalAmount, accountId }) => (
            <Skeleton loading={holdings.length > 0 ? false : true} active avatar>
              <List.Item onClick={() => router.push(`/accounts/${accountId}`)}>
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
      )
    }

    const holdingsArray = Object.entries(holdingsObjects).map((obj) => obj[1])

    return (
      <styled.AccountsCard title={props.title || "Accounts"} bordered={false}>
        {renderMultiple(holdingsArray, props.renderAssets, holdings)}

        {props.hasButton && (
          <styled.CenteredButton>
            <Button block onClick={() => router.push("/accounts/new")}>
              {" "}
              Link Account{" "}
            </Button>
          </styled.CenteredButton>
        )}
      </styled.AccountsCard>
    )
  }

  return renderList(holdings)
}

export default BanksList
