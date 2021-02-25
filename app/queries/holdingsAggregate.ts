import { resolver, Ctx, NotFoundError } from "blitz"
import db, { HoldingAggregateArgs } from "db"
import * as z from "zod"

const HoldingsAggregate = z.object({
  subAccountId: z.number(),
})

export default resolver.pipe(
  resolver.zod(HoldingsAggregate),
  resolver.authorize(),
  async (input) => {
    const aggregate = await db.holding.aggregate({
      sum: {
        fiatAmount: true,
      },
      where: {
        subAccountId: {
          equals: input.subAccountId,
        },
      },
    })

    return aggregate
  }
)

/*
type HoldingAggregateInput = Pick<HoldingAggregateArgs, "where" | "avg">

export default async function aggregateAccount({ where }: AccountAggregateInput, ctx: Ctx) {
  ctx.session.$authorize()

  const aggregate = await db.account.aggregate({ 
  })

  return aggregate
}
*/
