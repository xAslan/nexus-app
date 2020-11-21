import { Ctx } from "blitz"
import db, { AccountCreateArgs } from "db"

type CreateAccountInput = Pick<AccountCreateArgs, "data">
export default async function createAccount({ data }: CreateAccountInput, ctx: Ctx) {
  ctx.session.authorize()

  const account = await db.account.create({ data })

  return account
}
