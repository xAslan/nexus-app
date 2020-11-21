import { Ctx } from "blitz"
import db, { FindManyWalletArgs } from "db"

type GetWalletsInput = Pick<FindManyWalletArgs, "where" | "orderBy" | "skip" | "take">

export default async function getWallets(
  { where, orderBy, skip = 0, take }: GetWalletsInput,
  ctx: Ctx
) {
  ctx.session.authorize()

  const wallets = await db.wallet.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.wallet.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    wallets,
    nextPage,
    hasMore,
    count,
  }
}
