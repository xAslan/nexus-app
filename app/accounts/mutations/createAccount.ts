import { Ctx } from "blitz"
import db, { Prisma } from "db"

type CreateAccountInput = Pick<Prisma.AccountCreateArgs, "data">
export default async function createAccount({ data }: CreateAccountInput, ctx: Ctx) {
  console.log(data)
  ctx.session.authorize()
  const account = await db.account.create({ data })

  return account
}
