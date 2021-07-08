import { resolver, Ctx } from "blitz"
import * as z from "zod"
import { syncAccount } from "app/accounts/utils/accountSync"

const SyncAccount = z.object({
  accountId: z.number(),
  accountType: z.string(),
  userId: z.string().optional(),
  zaboAccountId: z.string().optional(),
  token: z.string().optional(),
})

export default resolver.pipe(
  resolver.zod(SyncAccount),
  resolver.authorize(),
  async (input, ctx: Ctx) => {
    return await syncAccount({
      ...input,
    })
  }
)
