import { Ctx, NotFoundError } from "blitz"
import db, { FindFirstAccountArgs } from "db"

type GetAccountInput = Pick<FindFirstAccountArgs, "where">

export default async function getAccount({ where }: GetAccountInput, ctx: Ctx) {
  ctx.session.authorize()

  const account = await db.account.findFirst({ where })

  if (!account) throw new NotFoundError()

  return account
}
