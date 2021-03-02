import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { useQuery, useRouter, useMutation, BlitzPage } from "blitz"
import createAccount from "app/accounts/mutations/createAccount"
import { AccountTypesForm } from "app/accounts/components/linkAccounts"
import { Spin, message } from "antd"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { accountTypes } from "app/accounts/components/accountTypes"
import * as styled from "app/accounts/components/styles"

const AccTypeForms = () => {
  const router = useRouter()
  const [createAccountMutation] = useMutation(createAccount)
  const [user] = useQuery(getCurrentUser, null)

  const handleAccountsTypeForm = async ({ type, account }) => {
    if (type === "crypto") {
      if (account.blockchain !== null) {
        try {
          const newAccount = await createAccountMutation({
            data: {
              ...account,
              zaboUser: user.zaboUserObj,
              accountType: accountTypes.BLOCKCHAIN_WALLET,
            },
          })
          message.success("Account Added!")
          router.push(`/accounts/${newAccount.id}`)
        } catch (err) {
          message.error(err.message)
        }
      } else {
        try {
          const newAccount = await createAccountMutation({
            data: {
              ...account,
              zaboUser: user.zaboUserObj,
              accountType: accountTypes.CRYPTO_EXCHANGE,
            },
          })
          message.success("Account Added!")
          router.push(`/accounts/${newAccount.id}`)
        } catch (err) {
          message.error(err.message)
        }
      } //- CRYPTO if/else

      //- Traditional Banks
    }
  }

  return (
    <styled.AccountsPageWrapper>
      <AccountTypesForm onSuccess={handleAccountsTypeForm} />
    </styled.AccountsPageWrapper>
  )
}

const NewAccountPage: BlitzPage = () => {
  return (
    <Suspense fallback={<Spin />}>
      <AccTypeForms />
    </Suspense>
  )
}

NewAccountPage.getLayout = (page) => <Layout title={"Create New Account"}>{page}</Layout>

export default NewAccountPage
