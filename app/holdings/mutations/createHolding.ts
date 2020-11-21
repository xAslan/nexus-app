import { Ctx } from "blitz"
import db, { HoldingCreateArgs } from "db"

type CreateHoldingInput = {
  data: Omit<HoldingCreateArgs["data"], "account">
  accountId: number
}
export default async function createHolding({ data, accountId }: CreateHoldingInput, ctx: Ctx) {
  ctx.session.authorize()

  const holding = await db.holding.create({
    data: { ...data, account: { connect: { id: accountId } } },
  })

  return holding
}
