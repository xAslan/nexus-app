import { Ctx } from "blitz"
import db, { WalletDeleteArgs } from "db"

type DeleteWalletInput = Pick<WalletDeleteArgs, "where">

export default async function deleteWallet({ where }: DeleteWalletInput, ctx: Ctx) {
  ctx.session.authorize()

  const wallet = await db.wallet.delete({ where })

  return wallet
}
