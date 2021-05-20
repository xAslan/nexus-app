import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetBalancesInput
  extends Pick<Prisma.BalanceFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetBalancesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { items: balances, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.balance.count({ where }),
      query: (paginateArgs) => db.balance.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      balances,
      nextPage,
      hasMore,
      count,
    }
  }
)
