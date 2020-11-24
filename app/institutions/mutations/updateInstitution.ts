import { Ctx } from "blitz"
import db, { InstitutionUpdateArgs } from "db"

type UpdateInstitutionInput = Pick<InstitutionUpdateArgs, "where" | "data">

export default async function updateInstitution({ where, data }: UpdateInstitutionInput, ctx: Ctx) {
  ctx.session.authorize()

  const institution = await db.institution.update({ where, data })

  return institution
}
