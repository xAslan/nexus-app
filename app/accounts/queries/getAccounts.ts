import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetAccountsInput = Pick<Prisma.FindManyAccountArgs, "where" | "orderBy" | "skip" | "take">

export default async function getAccounts(
  { where, orderBy, skip = 0, take }: GetAccountsInput,
  ctx: Ctx
) {
  ctx.session.authorize()

  const accounts = await db.account.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.account.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    accounts,
    nextPage,
    hasMore,
    count,
  }
}
