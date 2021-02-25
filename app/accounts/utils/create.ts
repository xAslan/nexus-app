import db from "db"
import { accountObjConstructor, holdingsConstructor } from "app/accounts/utils/constructors"

export const createMultipleHoldingsAccount = async (data, zaboObj, ctx, accountType) => {
  return await data.balances.reduce(async (acc, currentBalance, idx) => {
    console.log("Current balance data object")
    console.log(currentBalance)

    if (idx === 0) {
      const accountData = accountObjConstructor(data, zaboObj, ctx, currentBalance, accountType)
      const account = await db.account.create({
        data: accountData,
        select: { userId: true, id: true, subAccounts: true },
      })
      return await account
    }

    const holdingsData = holdingsConstructor(data, currentBalance)
    const account = await acc.then(async (accumulator) => {
      console.log("Accumulator")
      console.log(accumulator)

      console.log("Holdings Data")
      console.log(holdingsData)

      const account = await db.subAccount.update({
        where: {
          id: accumulator.account?.subAccounts[0]["id"]! ?? accumulator.subAccounts[0]["id"],
        },
        data: holdingsData,
        select: {
          account: {
            select: {
              userId: true,
              id: true,
              subAccounts: true,
            },
          },
        },
      })

      return account
    })

    return account
  }, {})
}

export const createSingleHoldingAccount = async (data, zaboObj, ctx, accountType) => {
  const accountData = accountObjConstructor(data, zaboObj, ctx, data.balances[0], accountType)
  const account = await db.account.create({ data: accountData })

  return account
}
