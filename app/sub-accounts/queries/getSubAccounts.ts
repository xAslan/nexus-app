import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetSubAccountsInput
  extends Pick<Prisma.SubAccountFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetSubAccountsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const { items: subAccounts, hasMore, nextPage, count } = await paginate({
      skip,
      take,
      count: () => db.subAccount.count({ where }),
      query: (paginateArgs) => db.subAccount.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      subAccounts,
      nextPage,
      hasMore,
      count,
    }
  }
)
