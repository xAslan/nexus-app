import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, usePaginatedQuery, useRouter, useParam, BlitzPage } from "blitz"
import getHoldings from "app/holdings/queries/getHoldings"

const ITEMS_PER_PAGE = 100

export const HoldingsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const accountId = useParam("accountId", "number")
  const [{ holdings, hasMore }] = usePaginatedQuery(getHoldings, {
    where: { account: { id: accountId } },
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {holdings.map((holding) => (
          <li key={holding.id}>
            <Link href={`/accounts/${accountId}/holdings/${holding.id}`}>
              <a>{holding.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const HoldingsPage: BlitzPage = () => {
  const accountId = useParam("accountId", "number")

  return (
    <div>
      <p>
        <Link href={`/accounts/${accountId}/holdings/new`}>
          <a>Create Holding</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <HoldingsList />
      </Suspense>
    </div>
  )
}

HoldingsPage.getLayout = (page) => <Layout title={"Holdings"}>{page}</Layout>

export default HoldingsPage
