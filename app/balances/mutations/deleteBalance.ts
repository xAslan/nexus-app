import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteBalance = z
  .object({
    id: z.number(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(DeleteBalance), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const balance = await db.balance.deleteMany({ where: { id } })

  return balance
})
