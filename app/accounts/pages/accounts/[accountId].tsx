import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import getAccount from "app/accounts/queries/getAccount"
import deleteAccount from "app/accounts/mutations/deleteAccount"
import syncAccount from "app/accounts/mutations/syncAccount"

export const Account = () => {
  const router = useRouter()
  const accountId = useParam("accountId", "number")
  const [account, { setQueryData }] = useQuery(getAccount, {
    where: { id: accountId },
  })
  const [deleteAccountMutation] = useMutation(deleteAccount)
  const [syncAccountMutation] = useMutation(syncAccount)

  const handleSync = async () => {
    const lastSync = new Date()
    const accountUpdates = {
      ...account,
      lastSync,
      syncStatus: "active",
    }
    try {
      setQueryData(accountUpdates, { refetch: false })
      console.log("start sync", accountUpdates)
      const updated = await syncAccountMutation({ accountId: account.id, lastSync })
      console.log("end sync", updated)
      setQueryData(updated)
    } catch (error) {
      setQueryData(account)
      console.log(error)
      alert("Error syncing account " + JSON.stringify(error, null, 2))
    }
  }

  return (
    <div>
      <h1>Account {account.id}</h1>
      <pre>{JSON.stringify(account, null, 2)}</pre>

      <Link href={`/accounts/${account.id}/edit`}>
        <a>Edit</a>
      </Link>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteAccountMutation({ where: { id: account.id } })
            router.push("/accounts")
          }
        }}
      >
        Delete
      </button>
      <button type="button" onClick={handleSync}>
        Sync Account
      </button>
    </div>
  )
}

const ShowAccountPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/accounts">
          <a>Accounts</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Account />
      </Suspense>
    </div>
  )
}

ShowAccountPage.getLayout = (page) => <Layout title={"Account"}>{page}</Layout>

export default ShowAccountPage
