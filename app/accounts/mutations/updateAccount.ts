import { Ctx } from "blitz"
import db, { AccountUpdateArgs } from "db"

type UpdateAccountInput = Pick<AccountUpdateArgs, "where" | "data">

export default async function updateAccount({ where, data }: UpdateAccountInput, ctx: Ctx) {
  ctx.session.authorize()

  const account = await db.account.update({ where, data })

  return account
}
