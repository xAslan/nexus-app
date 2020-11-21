import { Ctx } from "blitz"
import db, { WalletCreateArgs } from "db"

type CreateWalletInput = {
  data: Omit<WalletCreateArgs["data"], "account">
  accountId: number
}
export default async function createWallet({ data, accountId }: CreateWalletInput, ctx: Ctx) {
  ctx.session.authorize()

  const wallet = await db.wallet.create({
    data: { ...data, account: { connect: { id: accountId } } },
  })

  return wallet
}
