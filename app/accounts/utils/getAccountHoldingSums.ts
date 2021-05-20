import _ from "lodash"
import { toFiat } from "app/accounts/utils/exchange"
import { arrayIncludesWith } from "utils/utils"
import { invoke } from "blitz"
import getExchange from "app/queries/getExchange"

export const getAssetsAmounts = (account) => {
  return _.reduce(
    account.subAccounts,
    (acc, subAccount) => {
      const holdings = _.map(subAccount.holdings, (holding) => {
        if (
          arrayIncludesWith(acc, holding.assetId, (holdingAssetId, { assetId }) =>
            _.isEqual(holdingAssetId, assetId)
          )
        ) {
          const iddx = _.findIndex(acc, ["assetId", holding.assetId])
          const [{ amount }] = _.pullAt(acc, [iddx])
          const newAmount = amount + holding.amount
          return {
            amount: newAmount,
            assetId: holding.assetId,
            subAccountId: subAccount.id,
            accountId: subAccount.accountId,
            institution: account.institution,
            asset: holding.asset,
          }
        } else {
          return {
            assetId: holding.assetId,
            amount: holding.amount,
            subAccountId: subAccount.id,
            accountId: subAccount.accountId,
            institution: account.institution,
            asset: holding.asset,
          }
        }
      })

      return acc.concat(holdings)
    },
    []
  )
}

export const getFiatAmounts = async (uniqueHoldings = []) => {
  if (uniqueHoldings.length > 0) {
    const arrayOfSymbols = _.map(uniqueHoldings, (holding) =>
      _.flatMap(holding, ({ asset }) => asset.symbol)
    )
    const symbolsArray = _.reduce(
      arrayOfSymbols,
      (acc, currentArray) => _.uniq([...acc, ...currentArray]),
      []
    )
    const joinedSymbols = _.join(symbolsArray, ",")

    const exchangeData =
      typeof global.cache === "undefined" || global?.cache?.size === 0
        ? await invoke(getExchange, {})
        : await toFiat(joinedSymbols, "USD")

    const included = _.reduce(
      uniqueHoldings,
      (acc, currAccount) => {
        return acc.concat(
          currAccount.filter((holding) => {
            return exchangeData.some((obj) => holding.asset.symbol === obj.currency)
          })
        )
      },
      []
    )

    const excluded = _.reduce(
      uniqueHoldings,
      (acc, currAccount) => {
        return acc.concat(
          _.differenceWith(
            currAccount,
            exchangeData,
            ({ asset }, obj) => asset.symbol === obj.currency
          )
        )
      },
      []
    )

    const holdingsWithFakeFiatAmounts = _.map(excluded, (holding) => {
      if (holding.asset.type === "FIAT") {
        return {
          ...holding,
          fiatAmount: holding.amount,
        }
      }
      return {
        ...holding,
        fiatAmount: 0,
      }
    })

    const holdingsWithFiatAmounts = _.map(included, (holding) => {
      const { rate } = _.find(exchangeData, ({ currency }) => holding.asset.symbol === currency)
      const newPrice = Number(rate) * Number(holding.amount)

      return {
        ...holding,
        fiatAmount: newPrice,
      }
    })

    const mergedHoldings = holdingsWithFiatAmounts.concat(holdingsWithFakeFiatAmounts)

    const holdingsSum = _.sumBy(mergedHoldings, ({ fiatAmount }) => fiatAmount)

    return { holdingsSum, holdings: mergedHoldings }
  }
}
