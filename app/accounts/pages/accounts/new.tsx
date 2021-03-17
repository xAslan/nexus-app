import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { useQuery, useRouter, useMutation, BlitzPage } from "blitz"
import createAccount from "app/accounts/mutations/createAccount"
import { AccountTypesForm } from "app/accounts/components/linkAccounts"
import { Spin, message } from "antd"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { accountTypes } from "app/accounts/utils/accountTypes"
import * as styled from "app/accounts/components/styles"
import createPlaidAccount from "app/accounts/mutations/createPlaidAccount"

const AccTypeForms = () => {
  const router = useRouter()
  const [createAccountMutation] = useMutation(createAccount)
  const [createPlaidAccountMutation] = useMutation(createPlaidAccount)
  const [user] = useQuery(getCurrentUser, null)

  const handleSubmitError = (err) => {
    if (err.code === "P2002") {
      message.error("Account Already Belongs to User")
      return
    }

    message.error(err.message)
  }

  const handleAccountsTypeForm = async ({ type, account = {}, plaidAccessToken = null }) => {
    switch (type) {
      case accountTypes.BLOCKCHAIN_WALLET: {
        try {
          const newAccount = await createAccountMutation({
            data: {
              ...account,
              zaboUser: user.zaboUserObj!,
              accountType: type,
            },
          })
          message.success("Account Added!")
          router.push(`/accounts/${newAccount.id}`)
        } catch (err) {
          handleSubmitError(err)
        }

        break
      }

      case accountTypes.CRYPTO_EXCHANGE: {
        try {
          const newAccount = await createAccountMutation({
            data: {
              ...account,
              zaboUser: user.zaboUserObj!,
              accountType: type,
            },
          })
          message.success("Account Added!")
          router.push(`/accounts/${newAccount.id}`)
        } catch (err) {
          handleSubmitError(err)
        }

        break
      }

      default: {
        try {
          const plaidAccount = await createPlaidAccountMutation({
            accessToken: plaidAccessToken,
            accountType: type,
          })

          message.success("Account Added!")
          router.push(`/accounts/${plaidAccount.id}`)
        } catch (err) {
          message.error(err.message)
        }

        break
      }
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
