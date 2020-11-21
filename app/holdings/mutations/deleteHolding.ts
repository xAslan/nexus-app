import { Ctx } from "blitz"
import db, { HoldingDeleteArgs } from "db"

type DeleteHoldingInput = Pick<HoldingDeleteArgs, "where">

export default async function deleteHolding({ where }: DeleteHoldingInput, ctx: Ctx) {
  ctx.session.authorize()

  const holding = await db.holding.delete({ where })

  return holding
}
