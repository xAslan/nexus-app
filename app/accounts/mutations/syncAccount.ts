import { resolver, Ctx } from "blitz"
import db from "db"
import * as z from "zod"
import { accountTypes } from "app/accounts/utils/accountTypes"
import zaboInit from "app/accounts/utils/zabo-init"
import plaidClientInit from "app/accounts/utils/plaid-init"
import _ from "lodash"

const SyncAccount = z.object({
  accountId: z.number(),
  accountType: z.string(),
  userId: z.string(),
  zaboAccountId: z.string().optional(),
  token: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(SyncAccount),
  resolver.authorize(),
  async (input, ctx: Ctx) => {
    if (input.accountType === accountTypes.TRADITIONAL_BANKS) {
      const plaidClient = plaidClientInit()
      const { accounts } = await plaidClient.getBalance(input.token!)
      const { accountId, userId } = input

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

      const updatedHoldingsPrs = await newHoldings.map(
        async ({ assetId, subAccountId, amount }) => {
          return await db.holding.update({
            where: {
              subAccountUniqAsset: {
                assetId,
                subAccountId,
              },
            },
            data: { amount },
          })
        }
      )

      const updatedHoldings = await Promise.all(updatedHoldingsPrs)

      await db.account.update({
        where: {
          id: accountId,
        },
        data: {
          lastSync: new Date(),
          syncStatus: "inactive",
        },
      })

      return { updatedHoldings }
    } else {
      const zaboClient = await zaboInit()
      const { accountId, zaboAccountId, userId } = input
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

      await db.account.update({
        where: {
          id: accountId,
        },
        data: {
          lastSync: new Date(),
          syncStatus: "inactive",
        },
      })

      return updatedHoldings
    }
  }
)
