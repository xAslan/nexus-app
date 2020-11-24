import { Ctx, NotFoundError } from "blitz"
import db, { FindFirstInstitutionArgs } from "db"

type GetInstitutionInput = Pick<FindFirstInstitutionArgs, "where">

export default async function getInstitution({ where }: GetInstitutionInput, ctx: Ctx) {
  ctx.session.authorize()

  const institution = await db.institution.findFirst({ where })

  if (!institution) throw new NotFoundError()

  return institution
}
