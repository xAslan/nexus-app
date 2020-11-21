import Layout from "app/layouts/Layout"
import { Link, useRouter, useMutation, useParam, BlitzPage } from "blitz"
import createWallet from "app/wallets/mutations/createWallet"
import WalletForm from "app/wallets/components/WalletForm"

const NewWalletPage: BlitzPage = () => {
  const router = useRouter()
  const accountId = useParam("accountId", "number")
  const [createWalletMutation] = useMutation(createWallet)

  return (
    <div>
      <h1>Create New Wallet</h1>

      <WalletForm
        initialValues={{}}
        onSubmit={async () => {
          try {
            const wallet = await createWalletMutation({ data: { name: "MyName" }, accountId })
            alert("Success!" + JSON.stringify(wallet))
            router.push(`/accounts/${accountId}/wallets/${wallet.id}`)
          } catch (error) {
            alert("Error creating wallet " + JSON.stringify(error, null, 2))
          }
        }}
      />

      <p>
        <Link href={`/accounts/${accountId}/wallets`}>
          <a>Wallets</a>
        </Link>
      </p>
    </div>
  )
}

NewWalletPage.getLayout = (page) => <Layout title={"Create New Wallet"}>{page}</Layout>

export default NewWalletPage
