import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import getHolding from "app/holdings/queries/getHolding"
import deleteHolding from "app/holdings/mutations/deleteHolding"

export const Holding = () => {
  const router = useRouter()
  const holdingId = useParam("holdingId", "number")
  const accountId = useParam("accountId", "number")
  const [holding] = useQuery(getHolding, { where: { id: holdingId } })
  const [deleteHoldingMutation] = useMutation(deleteHolding)

  return (
    <div>
      <h1>Holding {holding.id}</h1>
      <pre>{JSON.stringify(holding, null, 2)}</pre>

      <Link href={`/accounts/${accountId}/holdings/${holding.id}/edit`}>
        <a>Edit</a>
      </Link>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteHoldingMutation({ where: { id: holding.id } })
            router.push(`/accounts/${accountId}/holdings`)
          }
        }}
      >
        Delete
      </button>
    </div>
  )
}

const ShowHoldingPage: BlitzPage = () => {
  const accountId = useParam("accountId", "number")

  return (
    <div>
      <p>
        <Link href={`/accounts/${accountId}/holdings`}>
          <a>Holdings</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Holding />
      </Suspense>
    </div>
  )
}

ShowHoldingPage.getLayout = (page) => <Layout title={"Holding"}>{page}</Layout>

export default ShowHoldingPage
