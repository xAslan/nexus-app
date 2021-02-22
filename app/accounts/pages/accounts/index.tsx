import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { useMutation, useSession, usePaginatedQuery, useQuery, useRouter, BlitzPage } from "blitz"
import getAccounts from "app/accounts/queries/getAccounts"
import { Spin, Button, Affix, Row, Col } from "antd"
import createAccount from "app/accounts/mutations/createAccount"
import AccountsView from "app/accounts/components/accountsView"
import { FaPlus } from "react-icons/fa"

const ITEMS_PER_PAGE = 10

export const AccountsList = () => {
  const router = useRouter()
  const session = useSession()
  const page = Number(router.query.page) || 0
  const [{ accounts }] = usePaginatedQuery(getAccounts, {
    orderBy: { id: "asc" },
    include: { subAccounts: { include: { holdings: { include: { asset: true } } } } },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const [createAccountMutation] = useMutation(createAccount)

  console.log("Account Aggregates")
  console.log(accountAgg)

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <>
      <Row justify="center">
        <Col xs={22}>
          <AccountsView accounts={accounts} />
        </Col>
      </Row>
      <Row justify="end">
        <Col xs={4}>
          <Affix offsetBottom={120}>
            <Button
              size="large"
              type="primary"
              shape="round"
              icon={<FaPlus />}
              onClick={() => router.push("/accounts/new")}
            >
              <strong style={{ marginLeft: ".48em" }}>Add Account</strong>
            </Button>
          </Affix>
        </Col>
      </Row>
    </>
  )
}

const AccountsPage: BlitzPage = () => (
  <Suspense fallback={<Spin />}>
    <AccountsList />
  </Suspense>
)

AccountsPage.getLayout = (page) => <Layout title={"Accounts"}>{page}</Layout>

export default AccountsPage
