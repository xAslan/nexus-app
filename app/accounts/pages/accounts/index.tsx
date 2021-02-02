import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { useMutation, useSession, Link, usePaginatedQuery, useRouter, BlitzPage } from "blitz"
import getAccounts from "app/accounts/queries/getAccounts"
import { Button } from "antd"
import Zabo from "zabo-sdk-js"
import createAccount from "app/accounts/mutations/createAccount"

const ITEMS_PER_PAGE = 10

export const AccountsList = () => {
  const router = useRouter()
  const session = useSession()
  const page = Number(router.query.page) || 0
  const [{ accounts }] = usePaginatedQuery(getAccounts, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const [createAccountMutation] = useMutation(createAccount)

  /* const goToPreviousPage = () => router.push({ query: { page: page - 1 } }) */
  /* const goToNextPage = () => router.push({ query: { page: page + 1 } }) */

  const connectWithZabo = async () => {
    const zabo = await Zabo.init({
      clientId: "Wj0YWr73LWUB9XTgQaC5N1r4VNoA9KZIy7V7HTFEs6L4iLFP3EUIzrHxXdbKydyM",
      env: "sandbox",
    })

    zabo
      .connect()
      .onConnection(async (account) => {
        console.log("Zabo Account Info")
        console.log(account)
        const dataArray = account.balances.map((balance) => {
          return {
            name: account.provider.display_name,
            type: "CRYPTO_EXCHANGE",
            institution: {
              connectOrCreate: {
                where: { name: account.display_name },
                create: {
                  name: account.display_name,
                  shortName: account.name,
                  type: "CRYPTO_EXCHANGE",
                },
              },
            },
            user: {
              connect: {
                id: session.userId,
              },
            },
            subAccounts: {
              create: {
                name: account.provider.name,
                clientAccountId: account.id,
                holdings: {
                  create: {
                    amount: Number.parseFloat(balance.balance),
                    asset: {
                      create: {
                        name: balance?.name! || balance.currency,
                        symbol: balance.currency,
                      },
                    },
                  },
                },
              },
            },
          }
        })

        const responses = await dataArray.map(async (data) => {
          return await createAccountMutation({ data })
        })

        console.log("Responses")
        console.log(responses)
      })
      .onError((err) => {
        console.log("Zabo Error")
        console.error(err.message)
      })
  }

  return (
    <div>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            <Link href={`/accounts/${account.id}`}>
              <a>{account.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <Button onClick={connectWithZabo} type="primary">
        {" "}
        Connect with Zabo{" "}
      </Button>

      {/*
        <button disabled={page === 0} onClick={goToPreviousPage}>
          Previous
        </button>
        <button disabled={!hasMore} onClick={goToNextPage}>
          Next
        </button>
      */}
    </div>
  )
}

const AccountsPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href="/accounts/new">
          <a>Create Account</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <AccountsList />
      </Suspense>
    </div>
  )
}

AccountsPage.getLayout = (page) => <Layout title={"Accounts"}>{page}</Layout>

export default AccountsPage
