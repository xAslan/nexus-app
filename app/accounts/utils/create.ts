import db from "db"
import { accountObjConstructor, holdingsConstructor } from "app/accounts/utils/constructors"

export const createMultipleHoldingsAccount = async (data, zaboObj, ctx, accountType) => {
  return await data.balances.reduce(async (acc, currentBalance, idx) => {
    if (idx === 0) {
      const accountData = accountObjConstructor(data, zaboObj, ctx, currentBalance, 0, accountType)
      const account = await db.account.create({
        data: accountData,
        select: { userId: true, id: true },
      })
      return await account
    }

    const holdingsData = holdingsConstructor(data, currentBalance)
    const account = await acc.then(async (accumulator) => {
      const account = await db.subAccount.update({
        where: {
          id: accumulator.id ?? accumulator.account.id,
        },
        data: holdingsData,
        select: { account: true },
      })

      return account
    })

    return account
  }, {})
}

export const createSingleHoldingAccount = async (data, zaboObj, ctx, accountType) => {
  const accountData = accountObjConstructor(data, zaboObj, ctx, data.balances[0], 0, accountType)
  const account = await db.account.create({ data: accountData, select: { userId: true } })

  return account
}
