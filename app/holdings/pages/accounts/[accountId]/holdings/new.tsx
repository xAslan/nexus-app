import Layout from "app/layouts/Layout"
import { Link, useRouter, useMutation, useParam, BlitzPage } from "blitz"
import createHolding from "app/holdings/mutations/createHolding"
import HoldingForm from "app/holdings/components/HoldingForm"

const NewHoldingPage: BlitzPage = () => {
  const router = useRouter()
  const accountId = useParam("accountId", "number")
  const [createHoldingMutation] = useMutation(createHolding)

  return (
    <div>
      <h1>Create New Holding</h1>

      <HoldingForm
        initialValues={{}}
        onSubmit={async () => {
          try {
            const holding = await createHoldingMutation({ data: { name: "MyName" }, accountId })
            alert("Success!" + JSON.stringify(holding))
            router.push(`/accounts/${accountId}/holdings/${holding.id}`)
          } catch (error) {
            alert("Error creating holding " + JSON.stringify(error, null, 2))
          }
        }}
      />

      <p>
        <Link href={`/accounts/${accountId}/holdings`}>
          <a>Holdings</a>
        </Link>
      </p>
    </div>
  )
}

NewHoldingPage.getLayout = (page) => <Layout title={"Create New Holding"}>{page}</Layout>

export default NewHoldingPage
