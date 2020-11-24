import Layout from "app/layouts/Layout"
import { Link, useRouter, useMutation, BlitzPage, useSession } from "blitz"
import createAccount from "app/accounts/mutations/createAccount"
import AccountForm from "app/accounts/components/AccountForm"

const NewAccountPage: BlitzPage = () => {
  const router = useRouter()
  const [createAccountMutation] = useMutation(createAccount)
  const session = useSession()
  return (
    <div>
      <h1>Create New Account</h1>
      <AccountForm
        initialValues={{}}
        onSubmit={async (event) => {
          console.log(event)
          console.log(event.target[0].value)
          console.log(event.target[1].value)
          console.log(event.target[2].value)
          console.log(event.target[3].value)
          try {
            const account = await createAccountMutation({
              data: {
                name: event.target[1].value,
                type: "finance",
                apiKey: event.target[2].value,
                apiSecret: event.target[3].value,
                institution: { connect: { id: parseInt(event.target[0].value) } },
                user: { connect: { id: session.userId } },
              },
            })
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

/*function getType(subType){
  if (subType == 'crypto')
    
}*/

NewAccountPage.getLayout = (page) => <Layout title={"Create New Account"}>{page}</Layout>

export default NewAccountPage