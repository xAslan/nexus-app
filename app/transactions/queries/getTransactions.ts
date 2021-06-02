import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetTransactionsInput
  extends Pick<Prisma.TransactionFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetTransactionsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { items: transactions, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.transaction.count({ where }),
      query: (paginateArgs) => db.transaction.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      transactions,
      nextPage,
      hasMore,
      count,
    }
  }
)
