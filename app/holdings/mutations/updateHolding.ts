import { Ctx } from "blitz"
import db, { HoldingUpdateArgs } from "db"

type UpdateHoldingInput = {
  where: HoldingUpdateArgs["where"]
  data: Omit<HoldingUpdateArgs["data"], "account">
  accountId: number
}

export default async function updateHolding({ where, data }: UpdateHoldingInput, ctx: Ctx) {
  ctx.session.authorize()

  // Don't allow updating
  delete (data as any).account

  const holding = await db.holding.update({ where, data })

  return holding
}
