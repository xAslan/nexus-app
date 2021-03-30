import { useReducer, useEffect } from "react"
import { Input, List, Button, Row, Col, Card } from "antd"
import * as styled from "app/users/components/styles"
import _ from "lodash"

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

const initialState = [{ assetId: null, amount: 0 }]

const holdingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "NEW_ASSET": {
      return [...state, action.payload]
    }

    case "SUM_ASSET": {
      const newState = state.map((holdingObj) => {
        if (holdingObj.assetId === action.payload.assetId) {
          const newAmount = holdingObj.amount + action.payload.amount
          return { ...holdingObj, amount: newAmount }
        }

        return holdingObj
      })

      return newState
    }

    default: {
      return state
    }
  }
}

//- holdingsCollection = [{assetId: 1, amount: 200}, {}...]

const BanksList = (props) => {
  const [holdingsCollection, dispatch] = useReducer(holdingsReducer, [])

  useEffect(() => {
    const sumedUp = props.accounts.map(({ subAccounts }) => {
      return subAccounts.map(({ holdings }) =>
        holdings.map((holding) => {
          if (!!_.find(holdingsCollection, ({ assetId }) => assetId === holding.assetId)) {
            dispatch({
              type: "SUM_ASSET",
              payload: { assetId: holding.assetId, amount: holding.amount },
            })
          } else {
            dispatch({
              type: "NEW_ASSET",
              payload: { assetId: holding.assetId, amount: holding.amount },
            })
          }
        })
      )
    })
  }, [props.accounts])

  return (
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

      <styled.CenteredButton>
        <Button block> Link Account </Button>
      </styled.CenteredButton>
    </styled.AccountsCard>
  )
}

export default BanksList
