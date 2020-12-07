import { Ctx, NotFoundError } from "blitz"
import db, { FindFirstAccountArgs } from "db"

type GetAccountInput = Pick<FindFirstAccountArgs, "where" | "include">

export default async function getAccount({ where, include }: GetAccountInput, ctx: Ctx) {
  ctx.session.authorize()

  const account = await db.account.findFirst({ where, include })

  if (!account) throw new NotFoundError()

  return account
}
