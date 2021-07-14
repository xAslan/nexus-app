import { Suspense, useState, useEffect, useRef, useCallback } from "react"
import Layout from "app/layouts/Layout"
import { useQuery, useParam, BlitzPage, useMutation } from "blitz"
import createTransactions from "app/transactions/mutations/createTransaction"
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

function sortTransactions(transactions, institution) {
  const unsortedTrx = transactions.map((trx) => {
    return { ...trx, institution: institution }
  })

  return unsortedTrx.sort((a, b) => a.confirmedAt.getTime() - b.confirmedAt.getTime())
}

export const Account = () => {
  const accountId = useParam("accountId", "number")
  const mountedRef = useRef(true)
  const [user] = useQuery(getCurrentUser, null)
  const [account, { setQueryData }] = useQuery(getAccount, {
    where: { id: accountId },
    include: {
      institution: true,
      subAccounts: { include: { holdings: { include: { asset: true } } } },
      transactions: true,
      balances: true,
      user: true,
    },
  })
  const [createTransactionsMutation] = useMutation(createTransactions)

  const balances = account.balances.map((b) => {
    return { timestamp: b.createdAt, value: b.amount }
  })

  const trxLists = sortTransactions(account.transactions, account.institution.name)
  const [transactions, setTransactions] = useState(trxLists)

  const fetchTrx = useCallback(async () => {
    const plaidSubAccounts = account.subAccounts.map((curr) => {
      return curr.clientAccountId
    })

    const trx = await createTransactionsMutation({
      accountType: account.type,
      zaboAccountId: account.zaboAccountId,
      zaboUserId: account.user.zaboUserObj.id,
      accountId: account.id,
      plaidToken: account.user.plaidToken,
      plaidSubAccounts,
    })

    const trxLists = sortTransactions(trx, account.institution.name)

    if (!mountedRef.current) return null

    setTransactions(trxLists)
  }, [mountedRef])

  useEffect(() => {
    fetchTrx()

    return () => {
      mountedRef.current = false
    }
  }, [account])

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
                  filter={(holding) => {
                    return holding.asset.type === "CRYPTO" && holding.fiatAmount > 0
                  }}
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
