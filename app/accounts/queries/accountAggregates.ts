import { Ctx, NotFoundError } from "blitz"
import db from "db"

// type GetAccountInput = Pick<FindFirstAccountArgs, "where" | "include">

export default async function getAccountAgg({ where, include }) {
  ctx.session.$authorize()

  const account = await db.account.findFirst({ where, include })

  if (!account) throw new NotFoundError()

  return account
}
