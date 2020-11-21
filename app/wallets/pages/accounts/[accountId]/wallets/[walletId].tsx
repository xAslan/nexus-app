import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import getWallet from "app/wallets/queries/getWallet"
import deleteWallet from "app/wallets/mutations/deleteWallet"

export const Wallet = () => {
  const router = useRouter()
  const walletId = useParam("walletId", "number")
  const accountId = useParam("accountId", "number")
  const [wallet] = useQuery(getWallet, { where: { id: walletId } })
  const [deleteWalletMutation] = useMutation(deleteWallet)

  return (
    <div>
      <h1>Wallet {wallet.id}</h1>
      <pre>{JSON.stringify(wallet, null, 2)}</pre>

      <Link href={`/accounts/${accountId}/wallets/${wallet.id}/edit`}>
        <a>Edit</a>
      </Link>

      <button
        type="button"
        onClick={async () => {
          if (window.confirm("This will be deleted")) {
            await deleteWalletMutation({ where: { id: wallet.id } })
            router.push(`/accounts/${accountId}/wallets`)
          }
        }}
      >
        Delete
      </button>
    </div>
  )
}

const ShowWalletPage: BlitzPage = () => {
  const accountId = useParam("accountId", "number")

  return (
    <div>
      <p>
        <Link href={`/accounts/${accountId}/wallets`}>
          <a>Wallets</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Wallet />
      </Suspense>
    </div>
  )
}

ShowWalletPage.getLayout = (page) => <Layout title={"Wallet"}>{page}</Layout>

export default ShowWalletPage
