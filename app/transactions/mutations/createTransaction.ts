import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import getTransactions from "app/transactions/utils"

const CreateTransaction = z
  .object({
    accountType: z.string(),
    accountId: z.number(),
    plaidToken: z.string().optional(),
    zaboUserId: z.string().optional(),
    zaboAccountId: z.string().optional(),
  })
  .nonstrict()

export default resolver.pipe(resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant

  const account = await db.account.findFirst({
    where: { id: input.accountId },
    include: { subAccounts: true },
  })

  const accountIds = account?.subAccounts.map((curr) => {
    return curr.clientAccountId
  })

  const transactions = await getTransactions({
    accountType: input.accountType,
    lastSync: account.lastSync,
    plaidToken: input.plaidToken,
    accountIds,
    accountId: input.accountId,
    zaboUserId: input.zaboUserId,
    zaboAccountId: input.zaboAccountId,
  })

  return transactions
})
