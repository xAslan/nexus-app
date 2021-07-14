import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import { accountTypes } from "app/accounts/utils/accountTypes"
import saveTrx from "app/transactions/utils/createPlaidTrx"
import storeTransactions from "app/transactions/utils/create"
import zaboInit from "app/accounts/utils/zabo-init"
import plaidClientInit from "app/accounts/utils/plaid-init"

const CreateTransaction = z
  .object({
    accountType: z.string(),
    accountId: z.number(),
    plaidToken: z.string().optional(),
    plaidSubAccounts: z.string().array().optional(),
    zaboUserId: z.string().optional(),
    zaboAccountId: z.string().optional(),
  })
  .nonstrict()

export default resolver.pipe(resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant

  if (input.accountType === accountTypes.TRADITIONAL_BANKS) {
    const plaidClient = plaidClientInit()

    const { transactions } = await plaidClient.getTransactions(
      input.plaidToken,
      "2021-01-01",
      "2021-06-01",
      { account_ids: input.accountIds }
    )

    const trx = await saveTrx(transactions, input.accountId)

    return trx
  }

  const zabo = await zaboInit()

  const transactions = await zabo.transactions.getList({
    userId: input.zaboUserId,
    accountId: input.zaboAccountId,
  })

  const trx = await storeTransactions(transactions.data, input.accountId)

  return trx
})
