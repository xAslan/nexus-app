import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import { accountTypes } from "app/accounts/utils/accountTypes"
import zaboInit from "app/accounts/utils/zabo-init"
import plaidClientInit from "app/accounts/utils/plaid-init"

const SyncAccount = z.object({
  accountId: z.string().optional(),
  accountType: z.string(),
  userId: z.string().optional(),
  token: z.string().optional(),
})

export default resolver.pipe(resolver.zod(SyncAccount), resolver.authorize(), async (input) => {
  if (input.accountType === accountTypes.TRADITIONAL_BANKS) {
    const plaidClient = plaidClientInit()
    const balances = await plaidClient.getBalance(input.token)

    return balances
  } else {
    const zaboClient = await zaboInit()

    const { accountId, userId } = input

    const balances = zaboClient.users.getBalances({ accountId, userId })

    return balances
  }
})
