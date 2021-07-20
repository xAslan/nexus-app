import { paginate, resolver, Ctx } from "blitz"
import db, { Prisma } from "db"
import zaboInit from "app/accounts/utils/zabo-init"
import * as z from "zod"

const GetTransaction = z
  .object({
    accountId: z.string(),
    accountType: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(GetTransaction),
  resolver.authorize(),
  async (input, ctx: Ctx) => {
    const zabo = await zaboInit()

    const { userId } = ctx.session
    const user = await db.user.findUnique({ where: { id: userId } })

    const transactions = await zabo.transactions.getList({
      userId: user?.zaboUserObj?.id,
      accountId: input.accountId,
    })

    return transactions
  }
)
