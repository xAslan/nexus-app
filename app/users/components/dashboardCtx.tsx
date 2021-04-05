import { useContext, createContext, useEffect, useState } from "react"
import _ from "lodash"
import { toFiat } from "app/accounts/utils/exchange"

const holdingsContext = createContext()

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

export const AggregateProvider = (props) => {
  const [holdingsAr, setHoldings] = useState({})

  useEffect(() => {
    const uniqueAmountsArray = []

    const runner = async function running() {
      _.forEach(props.accounts, (account) =>
        _.forEach(account.subAccounts, (subAccount) => {
          _.forEach(subAccount.holdings, (holding) => {
            if (
              arrayIncludesWith(
                uniqueAmountsArray,
                holding.assetId,
                (holdingAssetId, { assetId }) => _.isEqual(holdingAssetId, assetId)
              )
            ) {
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
        const exchangeData = (await toFiat(joinedSymbols, "USD")) || []
        const included = uniqueAmountsArray.filter((holding) =>
          exchangeData.some((obj) => holding.asset.symbol === obj.id)
        )
        const excluded = _.differenceWith(
          uniqueAmountsArray,
          exchangeData,
          ({ asset }, obj) => asset.symbol === obj.id
        )

        const holdingsWithFakeFiatAmounts = _.map(excluded, (holding) => ({
          ...holding,
          fiatAmount: holding.amount,
        }))

        const holdingsWithFiatAmounts = _.map(included, (holding) => {
          const { price } = _.find(exchangeData, ({ id }) => holding.asset.symbol === id)

          const newPrice = Number(price) * holding.amount
          return {
            ...holding,
            fiatAmount: newPrice,
          }
        })

        const mergedHoldings = holdingsWithFiatAmounts.concat(holdingsWithFakeFiatAmounts)

        const holdingsSum = _.sumBy(mergedHoldings, ({ fiatAmount }) => fiatAmount)

        setHoldings({ holdingsSum, holdings: mergedHoldings })
      }
    }

    runner()

    return () => (uniqueAmountsArray.length = 0)
  }, [props.accounts])

  return <holdingsContext.Provider value={holdingsAr}>{props.children}</holdingsContext.Provider>
}

export const useAggregates = () => useContext(holdingsContext)
