import { resolver, Ctx } from "blitz"
import * as z from "zod"
import { syncAllUserAccounts } from "app/accounts/utils/accountSync"

export default resolver.pipe(resolver.authorize(), async (input, ctx: Ctx) => {
  return await syncAllUserAccounts(ctx.session.userId)
})
