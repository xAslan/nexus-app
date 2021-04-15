import { Suspense } from "react"
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
import { PieDoughnutChart } from "app/components/PieDoughnutChart"
import LineChart from "app/components/LineChart"

const valueOfAccount = [
  { timestamp: 1612869664000, value: 200 },
  { timestamp: 1612626757000, value: 300 },
  { timestamp: 1612540357000, value: 350 },
  { timestamp: 1612194757000, value: 400 },
  { timestamp: 1611589957000, value: 315 },
  { timestamp: 1607594617000, value: 321 },
  { timestamp: 1610985157000, value: 233 },
  { timestamp: 1602342837000, value: 333 },
  { timestamp: 1612977237000, value: 231 },
  { timestamp: 1610380357000, value: 412 },
  { timestamp: 1610121157000, value: 344 },
  { timestamp: 1588949557000, value: 550 },
  { timestamp: 1581177157000, value: 553 },
  { timestamp: 1549641157000, value: 512 },
]

export const User = () => {
  const userId = useParam("userId", "number")
  const [user] = useQuery(getUser, { where: { id: userId } })
  const [{ accounts }] = useQuery(getAccounts, {
    where: { userId: user.id },
    include: {
      institution: true,
      subAccounts: { include: { holdings: { include: { asset: true } } } },
    },
  })

  return (
    <AggregateProvider accounts={accounts}>
      <Row justify="center" style={{ marginTop: "1.2em" }}>
        <Col xs={0} lg={22}>
          <Row justify="space-between">
            <Col xs={24} md={8} lg={6}>
              <TotalAmount />
              <BanksList />
            </Col>
            <Col xs={24} md={12}>
              <Row justify="space-between">
                <Col xs={24}>
                  <LineChart valueOfAccount={valueOfAccount} />
                </Col>
                <Col xs={24}>
                  <TransactionsTable />
                </Col>
              </Row>
            </Col>

            <Col xs={24} md={8} lg={5}>
              <Space direction="vertical">
                <PieDoughnutChart title="Crypto Currencies" type="Doughnut" />
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </AggregateProvider>
  )
}

const ErrorFallbackComponent = ({ error }) => {
  const router = useRouter()

  console.log(error)

  const renderError = (error) => {
    if (error.statusCode === 404) {
      return (
        <CenterContent>
          <section>
            <p> Sorry, you need to have at least one account</p>
            <Button type="primary" onClick={() => router.push("/accounts/new")}>
              {" "}
              Add Account{" "}
            </Button>
          </section>
        </CenterContent>
      )
    }

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

  return renderError(error)
}

const ShowUserPage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
        <User />
      </ErrorBoundary>
    </Suspense>
  )
}

ShowUserPage.getLayout = (page) => <DashboardLayout title={"User"}>{page}</DashboardLayout>

export default ShowUserPage
