import { Input, Table, Avatar, Progress, List, Button, Row, Col, Card } from "antd"
import * as styled from "app/users/components/styles"
import { IoWalletSharp } from "react-icons/io5"
import { BsCreditCard, BsExclamationCircle } from "react-icons/bs"

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

const RecentActivities = () => {
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
          <strong>${amount}</strong>
        </aside>
      </li>
    ))
  }

  return (
    <styled.RecentActivitiesCard title={<strong>Recent Activities</strong>}>
      <ul>{renderRecentActivitiesList(recentActivitiesList)}</ul>
    </styled.RecentActivitiesCard>
  )
}

export default RecentActivities
