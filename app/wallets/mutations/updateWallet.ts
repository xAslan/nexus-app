import { Ctx } from "blitz"
import db, { WalletUpdateArgs } from "db"

type UpdateWalletInput = {
  where: WalletUpdateArgs["where"]
  data: Omit<WalletUpdateArgs["data"], "account">
  accountId: number
}

export default async function updateWallet({ where, data }: UpdateWalletInput, ctx: Ctx) {
  ctx.session.authorize()

  // Don't allow updating
  delete (data as any).account

  const wallet = await db.wallet.update({ where, data })

  return wallet
}
