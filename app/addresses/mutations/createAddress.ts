import { Ctx } from "blitz"
import db, { AddressCreateArgs } from "db"

type CreateAddressInput = Pick<AddressCreateArgs, "data">
export default async function createAddress({ data }: CreateAddressInput, ctx: Ctx) {
  ctx.session.authorize()

  const address = await db.address.create({ data })

  return address
}
