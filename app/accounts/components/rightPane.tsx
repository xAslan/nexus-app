import { useRouter, useSession, useMutation } from "blitz"
import { message, Button, Spin, Row, Col, Space } from "antd"
import TotalAmount from "app/users/components/totalAmount"
import BanksList from "app/users/components/banksList"
import * as styled from "app/users/components/styles"
import createBalance from "app/balances/mutations/createBalance"
import { useAggregates } from "app/users/components/dashboardCtx"

const RightPaneComponent = (props) => {
  const router = useRouter()
  const [createBalanceMutation] = useMutation(createBalance)
  const session = useSession()
  const { account } = props
  const { holdingsSum } = useAggregates()

  const handleAddBalance = async (accountId, amount) => {
    try {
      const balance = await createBalanceMutation({ accountId, amount })
      message.success("Balance Added!")
    } catch (err) {
      message.error("Something went wrong")
    }
  }

  return (
    <>
      <TotalAmount title={account.institution.name} />
      <BanksList title="Assets" hasButton={false} renderAssets={true} />
      <styled.CenteredButton>
        <Button
          style={{ marginTop: "1em" }}
          block
          size="large"
          onClick={() => router.push(`/users/${session.userId}`)}
        >
          <strong>All Accounts</strong>
        </Button>
      </styled.CenteredButton>
      <styled.CenteredButton>
        <Button
          style={{ marginTop: "1em" }}
          block
          size="large"
          onClick={() => handleAddBalance(account.id, holdingsSum)}
        >
          <strong>Add Balance</strong>
        </Button>
      </styled.CenteredButton>
    </>
  )
}

export default RightPaneComponent
