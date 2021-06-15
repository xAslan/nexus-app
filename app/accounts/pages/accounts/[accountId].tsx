import { Suspense } from "react"
import Layout from "app/layouts/Layout"
import { useQuery, useParam, BlitzPage } from "blitz"
import getAccount from "app/accounts/queries/getAccount"
import deleteAccount from "app/accounts/mutations/deleteAccount"
import syncAccount from "app/accounts/mutations/syncAccount"
import getCurrentUser from "app/users/queries/getCurrentUser"
import AccountView from "app/accounts/components/accountsView"
import { Spin, Row, Col, Space } from "antd"
import RightPane from "app/accounts/components/rightPane"
import TransactionsTable from "app/users/components/transactionsTable"
import { AggregateProvider } from "app/users/components/dashboardCtx"
import { DiffPieChart, PieDoughnutChart } from "app/components/PieDoughnutChart"
import LineChart from "app/components/LineChart"

export const Account = () => {
  const accountId = useParam("accountId", "number")
  const [user] = useQuery(getCurrentUser, {})
  const [account, { setQueryData }] = useQuery(getAccount, {
    where: { id: accountId },
    include: {
      institution: true,
      subAccounts: { include: { holdings: { include: { asset: true } } } },
      transactions: true,
      balances: true,
    },
  })

  const balances = account.balances.map((b) => {
    return { timestamp: b.createdAt, value: b.amount }
  })

  const unsortedTrx = account.transactions.map((trx) => {
    return { ...trx, institution: account.institution.name }
  })

  const transactions = unsortedTrx.sort((a, b) => a.confirmedAt.getTime() - b.confirmedAt.getTime())

  return (
    <AggregateProvider accounts={account}>
      <Row justify="center" style={{ marginTop: "1.2em" }}>
        <Col xs={0} lg={22}>
          <Row justify="space-between">
            <Col xs={24} md={8} lg={6}>
              <RightPane account={account} />
            </Col>
            <Col xs={24} md={12}>
              <Row justify="space-between">
                <Col xs={24}>
                  <LineChart valueOfAccount={balances} />
                </Col>
                <Col xs={24}>
                  <TransactionsTable transactions={transactions} />
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={8} lg={5}>
              <Space direction="vertical">
                <PieDoughnutChart
                  title="Crypto Currencies"
                  type="Doughnut"
                  filter={(holding) => holding.asset.type === "CRYPTO"}
                />
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </AggregateProvider>
  )
}

const ShowAccountPage: BlitzPage = () => {
  return (
    <>
      <Suspense fallback={<Spin />}>
        <Account />
      </Suspense>
    </>
  )
}

ShowAccountPage.getLayout = (page) => <Layout title={"Account"}>{page}</Layout>

export default ShowAccountPage
