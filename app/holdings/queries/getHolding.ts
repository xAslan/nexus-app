import { Ctx, NotFoundError } from "blitz"
import db, { FindFirstHoldingArgs } from "db"

type GetHoldingInput = Pick<FindFirstHoldingArgs, "where">

export default async function getHolding({ where }: GetHoldingInput, ctx: Ctx) {
  ctx.session.authorize()

  const holding = await db.holding.findFirst({ where })

  if (!holding) throw new NotFoundError()

  return holding
}
