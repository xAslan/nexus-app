import db from "db"
import { accountTypes } from "app/accounts/utils/accountTypes"
import zaboInit from "app/accounts/utils/zabo-init"
import plaidClientInit from "app/accounts/utils/plaid-init"
import _ from "lodash"
import {
  getAssetsAmounts as getAccountAssetsAmount,
  getFiatAmounts as getAccountFiats,
} from "app/accounts/utils/getAccountSums"
import moment from "moment"
import getTransactions from "app/transactions/utils"

interface syncAccountArgs {
  accountId: number
  accountType: string
  userId?: string
  zaboAccountId?: string
  token?: string
}

//- TODO: Reduce the number of network requests by grouping zabo & plaid accounts into
//- one getBalance call.

export async function syncAccount({
  token,
  accountType,
  userId,
  accountId,
  zaboAccountId,
}: syncAccountArgs) {
  if (accountType === accountTypes.TRADITIONAL_BANKS) {
    const plaidClient = plaidClientInit()
    const { accounts } = await plaidClient.getBalance(token!)

    await db.account.update({
      where: {
        id: accountId,
      },
      data: {
        syncStatus: "active",
      },
    })

    const accountIds = _.flatMap(accounts, (curr) => curr.account_id)
    const subAccounts = await db.subAccount.findMany({
      where: {
        clientAccountId: { in: accountIds },
      },
      include: {
        holdings: { include: { asset: true } },
      },
    })

    const newHoldings = accounts.reduce((acc, curr) => {
      const [oneAcc] = subAccounts.filter((subAcc) => {
        if (subAcc.clientAccountId === curr.account_id) {
          return subAcc
        }
      })

      const holds = {
        holdingId: oneAcc.holdings[0]["id"],
        assetId: oneAcc.holdings[0]["asset"]["id"],
        amount: curr.balances.available || curr.balances.current,
        subAccountId: oneAcc.id,
      }

      return acc.concat(holds)
    }, [])

    const updatedHoldingsPrs = await newHoldings.map(async ({ assetId, subAccountId, amount }) => {
      return await db.holding.update({
        where: {
          subAccountUniqAsset: {
            assetId,
            subAccountId,
          },
        },
        data: { amount },
      })
    })

    const updatedHoldings = await Promise.all(updatedHoldingsPrs)

    return await db.account.update({
      where: {
        id: accountId,
      },
      data: {
        lastSync: new Date(),
        syncStatus: "inactive",
      },
      include: {
        institution: true,
        subAccounts: { include: { holdings: { include: { asset: true } } } },
      },
    })
  } else {
    const zaboClient = await zaboInit()
    const balances = await zaboClient.users.getBalances({ accountId: zaboAccountId, userId })

    await db.account.update({
      where: {
        id: accountId,
      },
      data: {
        syncStatus: "active",
      },
    })

    const [subAccount] = await db.subAccount.findMany({
      where: { accountId },
      include: { holdings: { include: { asset: true } } },
    })
    const newHoldings = subAccount.holdings.map((holding) => {
      const [newBalances] = balances.data
        .map((balance) => {
          if (balance.ticker === holding.asset.symbol) {
            return {
              holdingId: holding.id,
              assetId: holding.asset.id,
              amount: Number.parseFloat(balance.amount),
            }
          }
        })
        .filter((o) => o)

      return newBalances
    })

    const updatedHoldingsPrs = await newHoldings.map(async (holding) => {
      return await db.holding.update({
        where: {
          subAccountUniqAsset: {
            assetId: holding.assetId,
            subAccountId: subAccount.id,
          },
        },
        data: { amount: holding.amount },
      })
    })

    const updatedHoldings = Promise.all(updatedHoldingsPrs)

    return await db.account.update({
      where: {
        id: accountId,
      },
      data: {
        lastSync: new Date(),
        syncStatus: "inactive",
      },
      include: {
        institution: true,
        subAccounts: { include: { holdings: { include: { asset: true } } } },
      },
    })
  }
}

export async function syncAllUserAccounts(userId: number) {
  const user = await db.user.findFirst({
    where: { id: userId },
    include: {
      accounts: {
        include: {
          institution: true,
          subAccounts: { include: { holdings: { include: { asset: true } } } },
          transactions: true,
          balances: true,
        },
      },
    },
  })

  const balanceData = await user.accounts.map(async (account) => {
    const syncedAccount = await syncAccount({
      userId: user.zaboUserObj.id,
      zaboAccountId: account.zaboAccountId!,
      accountType: account.type,
      accountId: account.id,
      token: user.plaidToken!,
    })

    const syncedBalance = await updateBalance(syncedAccount)

    return syncedBalance
  })

  const trxData = await user.accounts.map(async (account) => {
    const accountIds = account.subAccounts.map(({ clientAccountId }) => clientAccountId)
    const transactions = await getTransactions({
      plaidToken: user.plaidToken,
      lastSync: account.lastSync,
      zaboAccountId: account.zaboAccountId,
      accountType: account.type,
      accountId: account.id,
      zaboUserId: user.zaboUserObj.id,
      accountIds,
    })
  })

  return Promise.all(balanceData)
}

export async function updateBalance(accountObj) {
  try {
    const accountsSums = await getAccountAssetsAmount(accountObj)
    const accountFiats = await getAccountFiats(accountsSums)

    const date = moment().format("YYYY-MM-DD")

    const balance = await db.balance.upsert({
      where: {
        dateAccountIdBalance: {
          accountId: accountObj.id,
          balanceDate: date,
        },
      },
      update: {
        amount: accountFiats?.holdingsSum,
      },
      create: {
        amount: accountFiats?.holdingsSum,
        balanceDate: date,
        account: {
          connect: {
            id: accountObj.id,
          },
        },
      },
    })

    return balance
  } catch (err) {
    console.log("Sync Balance Error")
    console.error(err)
    throw err
  }
}
