import { Ctx } from "blitz"
import db, { AccountDeleteArgs } from "db"

type DeleteAccountInput = Pick<AccountDeleteArgs, "where">

export default async function deleteAccount({ where }: DeleteAccountInput, ctx: Ctx) {
  ctx.session.authorize()

  // TODO: remove once Prisma supports cascading deletes
  await db.wallet.deleteMany({ where: { account: { id: where.id } } })
  const account = await db.account.delete({ where })

  return account
}
