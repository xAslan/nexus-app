import { Input } from "antd"
import * as styled from "app/users/components/styles"
import { transactionTypes } from "app/transactions/utils/types"
import _ from "lodash"

interface TransactionTableProps {
  date: Date
  bank: String
  trxType: TransactionTypes
  amount: Float
}

const getAmount = ({ amountSent, amountReceived }) => {
  if (amountSent > amountReceived) {
    return amountSent
  }

  return amountReceived
}

const renderDescription = (rec) => {
  if (rec.trxType === transactionTypes.TRADE) {
    return `Traded ${rec.currencySent} / ${rec.currencyReceived}`
  }

  const direction = rec.trxType === transactionTypes.DEPOSIT ? `in Account` : `from Account`

  return `${_.capitalize(rec.trxType)} ${direction}`
}

const TransactionsTable = (props) => {
  const trascationColumns = [
    {
      title: "Date",
      dataIndex: "confirmedAt",
      width: 120,
      render: (text, record) => text.toLocaleDateString(),
      responsive: ["md"],
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 250,
      render: (_, record) => {
        return `${renderDescription(record)}`
      },
      responsive: ["lg"],
    },
    {
      title: "Insitution",
      dataIndex: "institution",
      width: 150,
      render: (_, record) => record.institution,
    },
    {
      title: "Categories",
      dataIndex: "trxType",
      width: 150,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 120,
      render: (text, record) => {
        const amount = getAmount(record)
        return <p> ${amount.toLocaleString("en")} </p>
      },
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
      dataSource={props.transactions}
      scroll={{ y: 240 }}
    />
  )
}

export default TransactionsTable
