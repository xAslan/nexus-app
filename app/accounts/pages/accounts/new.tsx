import Layout from "app/layouts/Layout"
import { Link, useRouter, useMutation, BlitzPage } from "blitz"
import createAccount from "app/accounts/mutations/createAccount"
import AccountForm from "app/accounts/components/AccountForm"

const NewAccountPage: BlitzPage = () => {
  const router = useRouter()
  const [createAccountMutation] = useMutation(createAccount)

  return (
    <div>
      <h1>Create New Account</h1>

      <AccountForm
        initialValues={{}}
        onSubmit={async () => {
          try {
            const account = await createAccountMutation({ data: { name: "MyName" } })
            alert("Success!" + JSON.stringify(account))
            router.push(`/accounts/${account.id}`)
          } catch (error) {
            alert("Error creating account " + JSON.stringify(error, null, 2))
          }
        }}
      />

      <p>
        <Link href="/accounts">
          <a>Accounts</a>
        </Link>
      </p>
    </div>
  )
}

NewAccountPage.getLayout = (page) => <Layout title={"Create New Account"}>{page}</Layout>

export default NewAccountPage
