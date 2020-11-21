import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import getHolding from "app/holdings/queries/getHolding"
import updateHolding from "app/holdings/mutations/updateHolding"
import HoldingForm from "app/holdings/components/HoldingForm"

export const EditHolding = () => {
  const router = useRouter()
  const holdingId = useParam("holdingId", "number")
  const accountId = useParam("accountId", "number")
  const [holding, { setQueryData }] = useQuery(getHolding, { where: { id: holdingId } })
  const [updateHoldingMutation] = useMutation(updateHolding)

  return (
    <div>
      <h1>Edit Holding {holding.id}</h1>
      <pre>{JSON.stringify(holding)}</pre>

      <HoldingForm
        initialValues={holding}
        onSubmit={async () => {
          try {
            const updated = await updateHoldingMutation({
              where: { id: holding.id },
              data: { name: "MyNewName" },
            })
            await setQueryData(updated)
            alert("Success!" + JSON.stringify(updated))
            router.push(`/accounts/${accountId}/holdings/${updated.id}`)
          } catch (error) {
            console.log(error)
            alert("Error creating holding " + JSON.stringify(error, null, 2))
          }
        }}
      />
    </div>
  )
}

const EditHoldingPage: BlitzPage = () => {
  const accountId = useParam("accountId", "number")

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditHolding />
      </Suspense>

      <p>
        <Link href={`/accounts/${accountId}/holdings`}>
          <a>Holdings</a>
        </Link>
      </p>
    </div>
  )
}

EditHoldingPage.getLayout = (page) => <Layout title={"Edit Holding"}>{page}</Layout>

export default EditHoldingPage
