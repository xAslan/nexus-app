import { Ctx } from "blitz"
import db, { AccountDeleteArgs } from "db"

type DeleteAccountInput = Pick<AccountDeleteArgs, "where">

export default async function deleteAccount({ where }: DeleteAccountInput, ctx: Ctx) {
  ctx.session.$authorize()

  // TODO: remove once Prisma supports cascading deletes
  const subAccounts = await db.subAccount.delete({ where: { accountId: where.id } })

  await subAccounts.forEach(async (subAc) => {
    await db.holding.delete({ where: { subAccountId: subAc.id } })
  })
  const account = await db.account.delete({ where })

  return account
}
