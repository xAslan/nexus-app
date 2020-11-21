import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, usePaginatedQuery, useRouter, useParam, BlitzPage } from "blitz"
import getWallets from "app/wallets/queries/getWallets"

const ITEMS_PER_PAGE = 100

export const WalletsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const accountId = useParam("accountId", "number")
  const [{ wallets, hasMore }] = usePaginatedQuery(getWallets, {
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
        {wallets.map((wallet) => (
          <li key={wallet.id}>
            <Link href={`/accounts/${accountId}/wallets/${wallet.id}`}>
              <a>{wallet.name}</a>
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

const WalletsPage: BlitzPage = () => {
  const accountId = useParam("accountId", "number")

  return (
    <div>
      <p>
        <Link href={`/accounts/${accountId}/wallets/new`}>
          <a>Create Wallet</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <WalletsList />
      </Suspense>
    </div>
  )
}

WalletsPage.getLayout = (page) => <Layout title={"Wallets"}>{page}</Layout>

export default WalletsPage
