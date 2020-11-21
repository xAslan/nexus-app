import { Ctx } from "blitz"
import db, { FindManyAddressArgs } from "db"

type GetAddressesInput = Pick<FindManyAddressArgs, "where" | "orderBy" | "skip" | "take">

export default async function getAddresses(
  { where, orderBy, skip = 0, take }: GetAddressesInput,
  ctx: Ctx
) {
  ctx.session.authorize()

  const addresses = await db.address.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.address.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    addresses,
    nextPage,
    hasMore,
    count,
  }
}
