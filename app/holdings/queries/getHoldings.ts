import { Ctx } from "blitz"
import db, { FindManyHoldingArgs } from "db"

type GetHoldingsInput = Pick<FindManyHoldingArgs, "where" | "orderBy" | "skip" | "take">

export default async function getHoldings(
  { where, orderBy, skip = 0, take }: GetHoldingsInput,
  ctx: Ctx
) {
  ctx.session.authorize()

  const holdings = await db.holding.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.holding.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    holdings,
    nextPage,
    hasMore,
    count,
  }
}
