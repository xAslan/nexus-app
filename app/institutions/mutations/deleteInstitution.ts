import { Ctx } from "blitz"
import db, { InstitutionDeleteArgs } from "db"

type DeleteInstitutionInput = Pick<InstitutionDeleteArgs, "where">

export default async function deleteInstitution({ where }: DeleteInstitutionInput, ctx: Ctx) {
  ctx.session.authorize()

  const institution = await db.institution.delete({ where })

  return institution
}
