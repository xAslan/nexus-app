import { Suspense, useState } from "react"
import { Space, Button, Row, Col } from "antd"
import { ErrorBoundary } from "react-error-boundary"
import { DashboardLayout } from "app/layouts/Layout"
import { useRouter, useQuery, useParam, BlitzPage } from "blitz"
import { CenterContent } from "app/components/styles"

import getUser from "app/users/queries/getUser"
import getAccounts from "app/accounts/queries/getAccounts"
import * as styled from "app/users/components/styles"

import TransactionsTable from "app/users/components/transactionsTable"
import { AggregateProvider } from "app/users/components/dashboardCtx"
import TotalAmount from "app/users/components/totalAmount"
import BanksList from "app/users/components/banksList"
import { DiffPieChart, PieDoughnutChart } from "app/components/PieDoughnutChart"
import LineChart from "app/components/LineChart"
import _ from "lodash"

export const UserPageComponent = () => {
  const userId = useParam("userId", "number")
  const router = useRouter()
  const [user] = useQuery(getUser, { where: { id: userId } })
  const [{ accounts }] = useQuery(getAccounts, {
    where: { userId: user.id },
    include: {
      institution: true,
      subAccounts: { include: { holdings: { include: { asset: true } } } },
      transactions: true,
      balances: true,
      user: true,
    },
  })

  const getSumBalances = (balance = []) => {
    const keys = _.uniqBy(balance, (o) => o.timestamp)

    return _.map(keys, ({ timestamp }) => {
      const balanceByDate = _.filter(balance, (o) => o.timestamp === timestamp)

      return _.reduce(
        balanceByDate,
        (acc, curr) => {
          const balanceSum = curr.value + acc.value
          return { ...curr, value: balanceSum }
        },
        { value: 0 }
      )
    })
  }

  const renderAccounts = (accounts = []) => {
    if (accounts.length > 0) {
      const trxObj = accounts.reduce(
        (acc, { transactions, institution }) => acc.concat({ transactions, institution }),
        []
      )

      const unsortedTrx = trxObj.reduce((acc, { transactions, institution }) => {
        const innTrx = transactions.map((tr) => {
          return { ...tr, institution: institution.name }
        })

        return acc.concat(innTrx)
      }, [])

      const balances = accounts.reduce((acc, { balances }) => {
        const balancesObj = balances.map((b) => ({ timestamp: b.balanceDate, value: b.amount }))
        return acc.concat(balancesObj)
      }, [])

      const balanceSum = getSumBalances(balances)
      const transactions = unsortedTrx.sort(
        (a, b) => a.confirmedAt.getTime() - b.confirmedAt.getTime()
      )

      return (
        <AggregateProvider accounts={accounts}>
          <Row justify="center" style={{ marginTop: "1.2em" }}>
            <Col xs={0} lg={22}>
              <Row justify="space-between">
                <Col xs={24} md={8} lg={6}>
                  <TotalAmount />
                  <BanksList hasButton={true} />
                </Col>
                <Col xs={24} md={12}>
                  <Row justify="space-between">
                    <Col xs={24}>
                      <LineChart valueOfAccount={balanceSum} />
                    </Col>
                    <Col xs={24}>
                      <TransactionsTable transactions={transactions} />
                    </Col>
                  </Row>
                </Col>

                <Col xs={24} md={8} lg={5}>
                  <Space direction="vertical">
                    <DiffPieChart title="Traditional VS Crypto" type="Pie" />

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

    return (
      <CenterContent>
        <section>
          <p>Sorry, you need to at least have one account</p>
          <Button type="primary" onClick={() => router.push("/accounts/new")}>
            <strong>Create new account</strong>
          </Button>
        </section>
      </CenterContent>
    )
  }

  return renderAccounts(accounts)
}

const ErrorFallbackComponent = ({ error }) => {
  const router = useRouter()

  return (
    <CenterContent>
      <section>
        <p> Sorry, something went wrong, {error.message} </p>
        <Button type="primary" onClick={() => router.push("/")}>
          {" "}
          Go back home{" "}
        </Button>
      </section>
    </CenterContent>
  )
}

const ShowUserPage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
        <UserPageComponent />
      </ErrorBoundary>
    </Suspense>
  )
}

ShowUserPage.getLayout = (page) => <DashboardLayout title={"User"}>{page}</DashboardLayout>

export default ShowUserPage
