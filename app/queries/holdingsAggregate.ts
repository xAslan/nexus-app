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
    const aggregate = await db.holding.groupBy({
      by: ["assetId"],
      where: {
        subAccountId: {
          equals: input.subAccountId,
        },
      },
      sum: {
        amount: true,
      },
    })

    const asset = await db.asset.findFirst({ where: { id: aggregate.assetId } })

    return { ...aggregate, ...asset }
  }
)
