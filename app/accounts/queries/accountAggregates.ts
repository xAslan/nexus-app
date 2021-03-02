import { Ctx } from "blitz"
import db, { AccountAggregateArgs } from "db"

type AccountAggregateInput = Pick<AccountAggregateArgs, "where" | "avg">

export default async function aggregateAccount({ where }: AccountAggregateInput, ctx: Ctx) {
  ctx.session.$authorize()

  const aggregate = await db.account.aggregate({ where })

  return aggregate
}
