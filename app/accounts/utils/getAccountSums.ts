import _ from "lodash"
import { getCachedExchange } from "app/accounts/utils/exchange"
import { arrayIncludesWith } from "utils/utils"
import getExchange from "app/queries/getExchange"
import { invoke } from "blitz"

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
            lastSync: account.lastSync,
            user: account.user,
            zaboAccId: account.zaboAccountId,
          }
        } else {
          return {
            assetId: holding.assetId,
            amount: holding.amount,
            subAccountId: subAccount.id,
            accountId: subAccount.accountId,
            institution: account.institution,
            asset: holding.asset,
            lastSync: account.lastSync,
            user: account.user,
            zaboAccId: account.zaboAccountId,
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
    const arrayOfSymbols = _.flatMap(uniqueHoldings, ({ asset }) => asset.symbol)

    const exchangeData =
      typeof global?.cache?.size! === "undefined" || global?.cache?.size! === 0
        ? await invoke(getExchange, {})
        : getCachedExchange()

    const included = _.reduce(
      uniqueHoldings,
      (acc, currAccount, idx, arr) => {
        const curr = exchangeData
          .map((obj) => {
            if (obj.currency === currAccount.asset.symbol) {
              return currAccount
            }
          })
          .filter((o) => o)

        return acc.concat([...curr])
      },
      []
    )

    const excluded = _.differenceBy(uniqueHoldings, included, "assetId")

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
      const { price } = _.find(exchangeData, ({ currency }) => holding.asset.symbol === currency)
      const newPrice = Number(price) * Number(holding.amount)

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
