import { Ctx, NotFoundError } from "blitz"
import db, { FindFirstWalletArgs } from "db"

type GetWalletInput = Pick<FindFirstWalletArgs, "where">

export default async function getWallet({ where }: GetWalletInput, ctx: Ctx) {
  ctx.session.authorize()

  const wallet = await db.wallet.findFirst({ where })

  if (!wallet) throw new NotFoundError()

  return wallet
}
