import { Ctx } from "blitz"
import db, { InstitutionCreateArgs } from "db"

type CreateInstitutionInput = Pick<InstitutionCreateArgs, "data">
export default async function createInstitution({ data }: CreateInstitutionInput, ctx: Ctx) {
  ctx.session.authorize()

  const institution = await db.institution.create({ data })

  return institution
}
