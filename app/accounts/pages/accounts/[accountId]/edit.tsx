import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import getAccount from "app/accounts/queries/getAccount"
import updateAccount from "app/accounts/mutations/updateAccount"
import AccountForm from "app/accounts/components/AccountForm"
import { AccountsList } from ".."

export const EditAccount = () => {
  const router = useRouter()
  const accountId = useParam("accountId", "number")
  const [account, { setQueryData }] = useQuery(getAccount, { where: { id: accountId } })
  const [updateAccountMutation] = useMutation(updateAccount)

  return (
    <div>
      <h1>Edit Account {account.id}</h1>
      <pre>{JSON.stringify(account)}</pre>

      <AccountForm
        account={account}
        onSubmit={async (event) => {
          try {
            const updated = await updateAccountMutation({
              where: { id: account.id },
              data: {
                name: event.target[1].value,
                type: "finance",
                apiKey: event.target[2].value,
                apiSecret: event.target[3].value,
              },
            })
            await setQueryData(updated)
            alert("Success!" + JSON.stringify(updated))
            router.push(`/accounts/${updated.id}`)
          } catch (error) {
            console.log(error)
            alert("Error creating account " + JSON.stringify(error, null, 2))
          }
        }}
      />
    </div>
  )
}

const EditAccountPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditAccount />
      </Suspense>

      <p>
        <Link href="/accounts">
          <a>Accounts</a>
        </Link>
      </p>
    </div>
  )
}

EditAccountPage.getLayout = (page) => <Layout title={"Edit Account"}>{page}</Layout>

export default EditAccountPage
