import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const Savebalance = z
  .object({
    accountId: z.number(),
    amount: z.number(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(Savebalance), resolver.authorize(), async (input) => {
  try {
    const balance = await db.balance.create({
      data: {
        amount: input.amount,
        account: {
          connect: {
            id: input.accountId,
          },
        },
      },
    })

    return balance
  } catch (err) {
    return err
  }
})
