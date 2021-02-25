/***
 *
 * This is a concept file.
 * Please skip it as I be scratching
 *
 * my head with sample codes here and there
 * in this file
 *
 *
 */
import db from "db"
import { accountObjConstructor, holdingsConstructor } from "app/accounts/utils/constructors"

export const createMultipleHoldingsAccount = async (data, zaboObj, ctx) => {
  return await data.balances.reduce(async (acc, currentBalance, idx) => {
    if (idx === 0) {
      const accountData = accountObjConstructor(data, zaboObj, ctx, currentBalance)
      // const account = await db.account.create({data: accountData, select: {userId: true, id: true}})
      return accountData
    }

    const holdingsData = holdingsConstructor(data, currentBalance)

    /*
    return await acc.then(async (accumulator) => {
      const account = await db.subAccount.update({
        where: {
          id: accumulator.id 
        },
        data: holdingsData,
        select: {account: true}
      })
       *
       * I want account object to have 
       *
       * multiple holdings which can be
       *
       * easily consumed by the database.
       *
      */

    console.log("Accumulator")
    console.log(await acc)

    console.log("holdings ..")
    console.log(holdingsData)
    const accumulator = await acc

    const newAccount = {
      ...accumulator,
      subAccounts: {
        ...holdingsData,
      },
    }

    console.log("Mixuture accumulator and holdings  ..")
    console.log(newAccount)

    // return account
    return false
    // })
  }, {})
}

export const createSingleHoldingAccount = async (data, zaboObj, ctx) => {
  const accountData = accountObjConstructor(data, zaboObj, ctx, data.balances[0])
  const account = await db.account.create({ data: accountData, select: { userId: true } })

  return account
}
