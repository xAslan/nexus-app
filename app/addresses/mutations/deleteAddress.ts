import { Ctx } from "blitz"
import db, { AddressDeleteArgs } from "db"

type DeleteAddressInput = Pick<AddressDeleteArgs, "where">

export default async function deleteAddress({ where }: DeleteAddressInput, ctx: Ctx) {
  ctx.session.authorize()

  const address = await db.address.delete({ where })

  return address
}
