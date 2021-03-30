import { useReducer, useEffect, Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { DashboardLayout } from "app/layouts/Layout"
import { invoke, useRouter, useQuery, useParam, BlitzPage } from "blitz"
import { CenterContent } from "app/components/styles"

import getUser from "app/users/queries/getUser"
import getAccounts from "app/accounts/queries/getAccounts"
import PieChart from "app/users/components/Piechart"

import { Button, Row, Col } from "antd"
import * as styled from "app/users/components/styles"

import CashFlow from "app/users/components/cashflow"
import TransactionsTable from "app/users/components/transactionsTable"
import RecentActivities from "app/users/components/recentActivities"
import BanksList from "app/users/components/banksList"

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
    <Row justify="center" style={{ marginTop: "1.2em" }}>
      <Col xs={0} lg={22}>
        <Row justify="space-between">
          <Col xs={24} md={8} lg={6}>
            <styled.TotalAmountCard bordered={false}>
              <p>
                <strong>$10,000</strong>
                <span> +4% </span>
              </p>

              <p>
                <strong>&pound; 8,000</strong>
                <span> 30 days </span>
              </p>
            </styled.TotalAmountCard>
            <BanksList accounts={accounts} />
          </Col>
          <Col xs={24} md={12}>
            <Row justify="space-between">
              <Col xs={22} md={11}>
                <CashFlow />
              </Col>

              <Col xs={22} md={12}>
                <RecentActivities />
              </Col>

              <Col xs={24}>
                <TransactionsTable />
              </Col>
            </Row>
          </Col>

          <Col xs={24} md={8} lg={5}></Col>
        </Row>
      </Col>
    </Row>
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
