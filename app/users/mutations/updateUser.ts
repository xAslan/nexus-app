import { Ctx } from "blitz"
import db, { UserUpdateArgs } from "db"

type UpdateUserInput = Pick<UserUpdateArgs, "where" | "data">

export default async function updateUser({ where, data }: UpdateUserInput, ctx: Ctx) {
  ctx.session.authorize()

  const user = await db.user.update({ where, data })

  return user
}
