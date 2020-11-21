import { Ctx } from "blitz"
import db, { AddressUpdateArgs } from "db"

type UpdateAddressInput = Pick<AddressUpdateArgs, "where" | "data">

export default async function updateAddress({ where, data }: UpdateAddressInput, ctx: Ctx) {
  ctx.session.authorize()

  const address = await db.address.update({ where, data })

  return address
}
