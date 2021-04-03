import { useReducer, useEffect, useState } from "react"
import { Input, List, Button, Row, Col, Card } from "antd"
import * as styled from "app/users/components/styles"
import _ from "lodash"
import { toFiat } from "app/accounts/utils/exchange"

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

function arrayIncludesWith(array, value, comparator) {
  var index = -1,
    length = array == null ? 0 : array.length

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true
    }
  }
  return false
}

function arrayPush(array, values) {
  var index = -1,
    length = values.length,
    offset = array.length

  while (++index < length) {
    array[offset + index] = values[index]
  }
  return array
}

const initialState = [{ assetId: null, amount: 0 }]

const holdingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "NEW_ASSET": {
      return [...state, action.payload]
    }

    case "SUM_ASSET": {
      /* const newState = state.map((holdingObj) => { */
      /*   if (holdingObj.assetId === action.payload.assetId) { */
      /*     const newAmount = holdingObj.amount + action.payload.amount */
      /*     return { ...holdingObj, amount: newAmount } */
      /*   } */

      /*   return holdingObj */
      /* }) */

      let newState = [...state]

      const iddx = _.findIndex(newState, ["assetId", action.payload.assetId])
      const [{ amount }] = _.pullAt(newState, [iddx])

      console.log("old state")
      console.log(newState)

      const newAmount = amount + action.payload.amount
      arrayPush(newState, [
        {
          amount: newAmount,
          assetId: action.payload.assetId,
        },
      ])

      console.log("New state")
      console.log(newState)

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
  const [holdingsAr, setHoldings] = useState([])

  useEffect(() => {
    const uniqueAmountsArray = []

    const runner = async function running() {
      _.map(props.accounts, (account) =>
        _.map(account.subAccounts, (subAccount) => {
          _.map(subAccount.holdings, (holding) => {
            if (
              arrayIncludesWith(
                uniqueAmountsArray,
                holding.assetId,
                (holdingAssetId, { assetId }) => _.isEqual(holdingAssetId, assetId)
              )
            ) {
              console.log("Suming")
              const iddx = _.findIndex(uniqueAmountsArray, ["assetId", holding.assetId])
              const [{ amount }] = _.pullAt(uniqueAmountsArray, [iddx])
              const newAmount = amount + holding.amount
              arrayPush(uniqueAmountsArray, [
                {
                  amount: newAmount,
                  assetId: holding.assetId,
                  subAccountId: subAccount.id,
                  accountId: subAccount.accountId,
                  institution: account.institution,
                  asset: holding.asset,
                },
              ])
            } else {
              arrayPush(uniqueAmountsArray, [
                {
                  assetId: holding.assetId,
                  amount: holding.amount,
                  subAccountId: subAccount.id,
                  accountId: subAccount.accountId,
                  institution: account.institution,
                  asset: holding.asset,
                },
              ])
            }
          })
        })
      )

      if (uniqueAmountsArray.length > 0) {
        const symbolsArray = _.flatMap(uniqueAmountsArray, ({ asset }) => asset.symbol)
        const joinedSymbols = _.join(symbolsArray, ",")
        const exchangeData = await toFiat(joinedSymbols, "USD")
        const included = uniqueAmountsArray.filter((holding) =>
          exchangeData.some((obj) => holding.asset.symbol === obj.id)
        )
        const excluded = _.differenceWith(
          uniqueAmountsArray,
          exchangeData,
          ({ asset }, obj) => asset.symbol === obj.id
        )

        console.log("Included")
        console.log(included)

        console.log("Excluded")
        console.log(excluded)

        console.log(joinedSymbols)
        setHoldings(uniqueAmountsArray)
      }

      runner()
    }

    /* const sumedUp = props.accounts.map(({ subAccounts }) => { */
    /*   return subAccounts.map(({ holdings }) => */
    /*     holdings.map((holding) => { */
    /*       if (!!_.find(holdingsCollection, ({ assetId }) => assetId === holding.assetId)) { */
    /*         console.log("Suming asset") */
    /*         console.log(holdingsCollection) */
    /*         dispatch({ */
    /*           type: "SUM_ASSET", */
    /*           payload: { assetId: holding.assetId, amount: holding.amount }, */
    /*         }) */
    /*       } else { */
    /*         console.log("New asset") */
    /*         console.log(holdingsCollection) */
    /*         dispatch({ */
    /*           type: "NEW_ASSET", */
    /*           payload: { assetId: holding.assetId, amount: holding.amount }, */
    /*         }) */
    /*       } */
    /*     }) */
    /*   ) */
    /* }) */

    return () => (uniqueAmountsArray.length = 0)
  }, [props.accounts])

  console.log(holdingsAr)
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
