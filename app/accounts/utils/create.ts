import db from "db"
import { accountsConstructor, subAccountsConstructor } from "app/accounts/utils/plaid-constructors"
import { accountObjConstructor, holdingsConstructor } from "app/accounts/utils/constructors"
import { accountTypes } from "app/accounts/utils/accountTypes"

export const createMultipleHoldingsAccount = async (data, zaboAccountId, userId, accountType) => {
  return await data.balances.reduce(async (acc, currentBalance, idx) => {
    if (idx === 0) {
      const accountData = accountObjConstructor(
        data,
        zaboAccountId,
        userId,
        currentBalance,
        accountType
      )
      const account = await db.account.create({
        data: accountData,
        select: { userId: true, id: true, subAccounts: true, zaboAccountId: true },
      })
      return await account
    }

    const holdingsData = holdingsConstructor(data, currentBalance)
    const account = await acc.then(async (accumulator) => {
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
              zaboAccountId: true,
            },
          },
        },
      })

      return account
    })

    return account
  }, {})
}

export const createSinglePlaidAccount = async (
  plaidObj,
  userId,
  accountType = AccountTypes.TRADITIONAL_BANKS
) => {
  const accountData = accountsConstructor(plaidObj, userId, plaidObj.accounts[0], accountType)
  const account = await db.account.create({ data: accountData })
  return account
}

export const createMultipleSubAccounts = async (
  plaidObj,
  userId,
  accountType = AccountTypes.TRADITIONAL_BANKS
) => {
  return await plaidObj.accounts.reduce(async (acc, currentAccount, idx) => {
    if (idx === 0) {
      const accountData = accountsConstructor(plaidObj, userId, currentAccount, accountType)
      const account = await db.account.create({
        data: accountData,
        select: { userId: true, id: true },
      })
      return await account
    }

    const subAccountData = subAccountsConstructor(currentAccount)
    const account = await acc.then(async (accumulator) => {
      const account = await db.account.update({
        where: {
          id: accumulator.id,
        },
        data: subAccountData,
        select: {
          userId: true,
          id: true,
          subAccounts: true,
        },
      })

      return account
    })

    return account
  }, {})
}

export const createSingleHoldingAccount = async (data, zaboAccountId, userId, accountType) => {
  const accountData = accountObjConstructor(
    data,
    zaboAccountId,
    userId,
    data.balances[0],
    accountType
  )
  const account = await db.account.create({
    data: accountData,
    select: { zaboAccountId: true, id: true, userId: true },
  })

  return { account }
}
