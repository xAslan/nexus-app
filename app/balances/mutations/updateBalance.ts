import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const UpdateBalance = z
  .object({
    id: z.number(),
    name: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(UpdateBalance),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const balance = await db.balance.update({ where: { id }, data })

    return balance
  }
)
