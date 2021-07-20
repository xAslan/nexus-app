import _ from "lodash"
import { getCachedExchange } from "app/accounts/utils/exchange"
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
    const exchangeData = await invoke(getExchange, {})

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
