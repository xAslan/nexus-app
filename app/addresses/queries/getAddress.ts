import { Ctx, NotFoundError } from "blitz"
import db, { FindFirstAddressArgs } from "db"

type GetAddressInput = Pick<FindFirstAddressArgs, "where">

export default async function getAddress({ where }: GetAddressInput, ctx: Ctx) {
  ctx.session.authorize()

  const address = await db.address.findFirst({ where })

  if (!address) throw new NotFoundError()

  return address
}
