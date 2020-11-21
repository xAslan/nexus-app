import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { Link, useRouter, useQuery, useMutation, useParam, BlitzPage } from "blitz"
import getWallet from "app/wallets/queries/getWallet"
import updateWallet from "app/wallets/mutations/updateWallet"
import WalletForm from "app/wallets/components/WalletForm"

export const EditWallet = () => {
  const router = useRouter()
  const walletId = useParam("walletId", "number")
  const accountId = useParam("accountId", "number")
  const [wallet, { setQueryData }] = useQuery(getWallet, { where: { id: walletId } })
  const [updateWalletMutation] = useMutation(updateWallet)

  return (
    <div>
      <h1>Edit Wallet {wallet.id}</h1>
      <pre>{JSON.stringify(wallet)}</pre>

      <WalletForm
        initialValues={wallet}
        onSubmit={async () => {
          try {
            const updated = await updateWalletMutation({
              where: { id: wallet.id },
              data: { name: "MyNewName" },
            })
            await setQueryData(updated)
            alert("Success!" + JSON.stringify(updated))
            router.push(`/accounts/${accountId}/wallets/${updated.id}`)
          } catch (error) {
            console.log(error)
            alert("Error creating wallet " + JSON.stringify(error, null, 2))
          }
        }}
      />
    </div>
  )
}

const EditWalletPage: BlitzPage = () => {
  const accountId = useParam("accountId", "number")

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditWallet />
      </Suspense>

      <p>
        <Link href={`/accounts/${accountId}/wallets`}>
          <a>Wallets</a>
        </Link>
      </p>
    </div>
  )
}

EditWalletPage.getLayout = (page) => <Layout title={"Edit Wallet"}>{page}</Layout>

export default EditWalletPage
