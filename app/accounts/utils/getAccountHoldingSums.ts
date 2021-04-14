import _ from "lodash"
import { toFiat } from "app/accounts/utils/exchange"

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

function throttleAsync(fn, wait) {
  let lastRun = 0

  async function throttled(...args) {
    const currentWait = lastRun + wait - Date.now()
    const shouldRun = currentWait <= 0

    if (shouldRun) {
      lastRun = Date.now()
      return await fn(...args)
    } else {
      return await new Promise(function (resolve) {
        setTimeout(function () {
          resolve(throttled())
        }, currentWait)
      })
    }
  }

  return throttled
}

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
    const exchangeData = await toFiat(joinedSymbols, "USD")

    const included = _.reduce(
      uniqueHoldings,
      (acc, currAccount) => {
        return acc.concat(
          currAccount.filter((holding) => {
            return exchangeData.some((obj) => holding.asset.symbol === obj.id)
          })
        )
      },
      []
    )

    const excluded = _.reduce(
      uniqueHoldings,
      (acc, currAccount) => {
        return acc.concat(
          _.differenceWith(currAccount, exchangeData, ({ asset }, obj) => asset.symbol === obj.id)
        )
      },
      []
    )

    const holdingsWithFakeFiatAmounts = _.map(excluded, (holding) => ({
      ...holding,
      fiatAmount: holding.amount,
    }))

    const holdingsWithFiatAmounts = _.map(included, (holding) => {
      const { price } = _.find(exchangeData, ({ id }) => holding.asset.symbol === id)
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
