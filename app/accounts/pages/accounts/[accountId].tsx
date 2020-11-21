import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import getAccount from "app/accounts/queries/getAccount"
import deleteAccount from "app/accounts/mutations/deleteAccount"

export const Account = () => {
  const router = useRouter()
  const accountId = useParam("accountId", "number")
  const [account] = useQuery(getAccount, { where: { id: accountId } })
  const [deleteAccountMutation] = useMutation(deleteAccount)

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
