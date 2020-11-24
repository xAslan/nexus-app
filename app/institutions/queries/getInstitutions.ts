import { Ctx } from "blitz"
import db, { FindManyInstitutionArgs } from "db"

type GetInstitutionsInput = Pick<FindManyInstitutionArgs, "where" | "orderBy" | "skip" | "take">

export default async function getInstitutions(
  { where, orderBy, skip = 0, take }: GetInstitutionsInput,
  ctx: Ctx
) {
  ctx.session.authorize()

  const institutions = await db.institution.findMany({
    where,
    orderBy,
    take,
    skip,
  })

  const count = await db.institution.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    institutions,
    nextPage,
    hasMore,
    count,
  }
}
