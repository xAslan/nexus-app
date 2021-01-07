import { Ctx } from "blitz"
import db, { UserCreateArgs } from "db"

type CreateUserInput = Pick<UserCreateArgs, "data">
export default async function createUser({ data }: CreateUserInput, ctx: Ctx) {
  ctx.session.authorize()

  const user = await db.user.create({ data })

  return user
}
