import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import plaidInit from "app/accounts/utils/plaid-init"

const PlaidInvestments = z.object({
  userId: z.number(),
  plaidToken: z.string(),
})

export default resolver.pipe(
  resolver.zod(PlaidInvestments),
  resolver.authorize(),
  async (input) => {
    const plaidClient = await plaidInit()
    const investments = await plaidClient.getHoldings(input.plaidToken)

    return investments
  }
)
