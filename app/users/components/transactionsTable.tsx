import { Input } from "antd"
import * as styled from "app/users/components/styles"

const transactionData = [
  {
    date: "12/12/2018",
    description: "Internal Paid Marketing related",
    bank: "Ally Bank",
    categories: "Interest",
    amount: "1000",
  },
  {
    date: "12/12/2018",
    description: "Internal Paid Marketing related",
    bank: "Chase Bank",
    categories: "Icome",
    amount: "1500",
  },
  {
    date: "12/12/2019",
    description: "Internal Paid Marketing related",
    bank: "Binance Bank",
    categories: "Interest",
    amount: "4000",
  },
  {
    date: "12/05/2020",
    description: "Internal Paid Marketing related",
    bank: "Ally Bank",
    categories: "Expense",
    amount: "200",
  },
  {
    date: "12/01/2019",
    description: "Internal Paid Marketing related",
    bank: "Chase Bank",
    categories: "Icome",
    amount: "3500",
  },
  {
    date: "12/12/2019",
    description: "Internal Paid Marketing related",
    bank: "Binance",
    categories: "Interest",
    amount: "500",
  },
]

const TransactionsTable = () => {
  const trascationColumns = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 300,
    },
    {
      title: "Bank",
      dataIndex: "bank",
    },
    {
      title: "Categories",
      dataIndex: "categories",
      width: 110,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 100,
      render: (text, record) => <p> ${text} </p>,
    },
  ]

  return (
    <styled.TransactionsTable
      title={() => (
        <header>
          <strong>All Trascactions</strong>
          <span>
            <Input.Search placeholder="Search Transactions" />
          </span>
        </header>
      )}
      columns={trascationColumns}
      dataSource={transactionData}
      scroll={{ y: 240 }}
    />
  )
}

export default TransactionsTable
