import { Suspense } from "react"
import { DashboardLayout } from "app/layouts/Layout"
import { Link, useRouter, useQuery, useParam, BlitzPage, useMutation } from "blitz"
import getUser from "app/users/queries/getUser"
import deleteUser from "app/users/mutations/deleteUser"
import getAccount from "app/accounts/queries/getAccount"
import PieChart from "app/users/components/Piechart"
import { Avatar, Progress, List, Button, Row, Col, Card } from "antd"
import * as styled from "app/users/components/styles"
import { IoWalletSharp } from "react-icons/io5"
import { BsCreditCard, BsExclamationCircle } from "react-icons/bs"

const banksList = [
  {
    bankName: "Ally Bank",
    savingsUSD: 5000.0,
    savingsGBP: 3400.04,
    text: "Interest Checking-Earning in 2020",
  },
  {
    bankName: "Chase Bank",
    savingsUSD: 0.0,
    savingsGBP: 0.0,
    text: "Interest Checking-Earning in 2020",
  },
  {
    bankName: "Ally Bank",
    savingsUSD: 2500.0,
    savingsGBP: 2403.04,
    text: "Interest Checking-Earning in 2020",
  },
  {
    bankName: "Binance Bank",
    savingsUSD: 2500,
    savingsGBP: 2043.05,
    text: "Interest Checking-Earning in 2020",
  },
]

const recentActivitiesList = [
  {
    name: "Purchase BTC",
    date: "22 Sept, 4:30pm",
    amount: "5000.00",
    icon: <IoWalletSharp />,
    worthy: true,
  },
  {
    name: "Credit Card",
    date: "20 Sept. 11:00am",
    amount: "500.00",
    icon: <BsCreditCard />,
    worthy: true,
  },
  {
    name: "Rent",
    date: "1 Jan, 12:00am",
    amount: "500",
    icon: <BsExclamationCircle />,
    worthy: false,
  },
  {
    name: "Purchase BTC",
    date: "25 Dec. 12:03pm",
    amount: "100.50",
    icon: <IoWalletSharp />,
    worthy: true,
  },
  {
    name: "Credit Card",
    date: "21 Aug. 12:00am",
    amount: "600.90",
    icon: <BsCreditCard />,
    worthy: true,
  },
]

export const User = () => {
  const router = useRouter()
  const userId = useParam("userId", "number")
  const [user] = useQuery(getUser, { where: { id: userId } })
  const [deleteUserMutation] = useMutation(deleteUser)
  const [account] = useQuery(getAccount, {
    where: { userId: user.id },
    include: { holdings: true },
  })
  const { holdings } = account
  const chartData = holdings.map(({ amount, symbol }) => ({
    value: amount,
    name: symbol,
  }))

  const renderRecentActivitiesList = (list) => {
    return list.map(({ name, date, worthy, icon, amount }, idx) => (
      <li key={idx}>
        <main>
          <Avatar
            size={{ xs: 24, md: 32, lg: 36, xl: 42, xxl: 42 }}
            icon={icon}
            style={{ backgroundColor: worthy ? "rgba(21, 74, 57, .6)" : "rgba(244, 122, 31, .5)" }}
          />
          <p>
            <strong> {name} </strong>
            <span> {date} </span>
          </p>
        </main>
        <aside>
          <strong>{amount}</strong>
        </aside>
      </li>
    ))
  }

  return (
    <Row justify="center">
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

        <styled.AccountsCard title="Accounts" bordered={false}>
          <List
            itemLayout="horizontal"
            dataSource={banksList}
            renderItem={({ bankName, savingsUSD, savingsGBP, text }) => (
              <List.Item>
                <styled.BanksList>
                  <div>
                    <strong> {bankName} </strong>
                    <strong> ${savingsUSD} </strong>
                  </div>

                  <div>
                    <span> {text} </span>
                    <span> {savingsGBP} </span>
                  </div>
                </styled.BanksList>
              </List.Item>
            )}
          />
        </styled.AccountsCard>

        <styled.CenteredButton>
          <Button block> Link Account </Button>
        </styled.CenteredButton>
      </Col>

      <Col xs={24} md={12}>
        <Row justify="space-between">
          <Col xs={22} md={11}>
            <styled.CashFlowCard
              title={
                <header>
                  <strong>Cash Flow</strong>
                  <a> View Full Report </a>
                </header>
              }
            >
              <ul>
                <li>
                  <p>
                    {" "}
                    <span> Income Last Month </span> <span> $5000 </span>{" "}
                  </p>
                  <Progress percent={60} format={(percent) => ``} />
                </li>
                <li>
                  <p>
                    {" "}
                    <span>Last Month</span> <span> $3000 </span>{" "}
                  </p>
                  <Progress percent={30} status="active" format={(percent) => ``} />
                </li>
                <li>
                  <p>
                    {" "}
                    <span>Expense this Month</span> <span> $900 </span>{" "}
                  </p>
                  <Progress percent={70} status="normal" format={(percent) => ``} />
                </li>
                <li>
                  <p>
                    {" "}
                    <span>Transfer Last Month</span> <span> $8000 </span>{" "}
                  </p>
                  <Progress status="exception" percent={80} format={(percent) => ``} />
                </li>
              </ul>
            </styled.CashFlowCard>
          </Col>

          <Col xs={22} md={12}>
            <styled.RecentActivitiesCard title={<strong>Recent Activities</strong>}>
              <ul>{renderRecentActivitiesList(recentActivitiesList)}</ul>
            </styled.RecentActivitiesCard>
          </Col>
        </Row>
      </Col>

      <Col xs={24} md={8} lg={6}></Col>
    </Row>
  )
}

const ShowUserPage: BlitzPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <User />
    </Suspense>
  )
}

ShowUserPage.getLayout = (page) => <DashboardLayout title={"User"}>{page}</DashboardLayout>

export default ShowUserPage
