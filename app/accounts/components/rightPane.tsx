import { useRouter, useSession, invoke } from "blitz"
import { Button } from "antd"
import TotalAmount from "app/users/components/totalAmount"
import BanksList from "app/users/components/banksList"
import { accountTypes } from "app/accounts/utils/accountTypes"
import * as styled from "app/users/components/styles"
import syncAccount from "app/accounts/mutations/syncAccount"
import toast, { Toaster } from "react-hot-toast"
import moment from "moment"

const RightPaneComponent = (props) => {
  const router = useRouter()
  const session = useSession()
  const { account } = props
  const date = moment(account.lastSync)

  const handleSync = async () => {
    if (account.type === accountTypes.TRADITIONAL_BANKS) {
      const syncResponse = await invoke(syncAccount, {
        token: account.user.plaidToken,
        accountType: account.type,
        accountId: account.id,
        userId: account.user.id,
      })

      console.log(syncResponse)
      toast.success("Sync Complete!")
    } else {
      const syncResponse = await invoke(syncAccount, {
        zaboAccountId: account.zaboAccountId,
        accountId: account.id,
        userId: account.user.zaboUserObj.id,
        accountType: account.type,
      })

      console.log(syncResponse)
      toast.success("Sync Complete!")
    }
  }

  return (
    <>
      <Toaster />
      <TotalAmount title={account.institution.name} />
      {account.lastSync ? <p> Last Sync {date.format("YYYY-MM-DD")} </p> : <p> Never Synced </p>}
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
        <Button style={{ marginTop: "1em" }} block size="large" onClick={() => handleSync()}>
          <strong>Sync Now</strong>
        </Button>
      </styled.CenteredButton>
    </>
  )
}

export default RightPaneComponent
