import { useRouter, useSession } from "blitz"
import { Button } from "antd"
import TotalAmount from "app/users/components/totalAmount"
import BanksList from "app/users/components/banksList"
import * as styled from "app/users/components/styles"

const RightPaneComponent = (props) => {
  const router = useRouter()
  const session = useSession()
  const { account } = props

  return (
    <>
      <TotalAmount account={account} title={account.institution.name} />
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
    </>
  )
}

export default RightPaneComponent
