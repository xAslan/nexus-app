import { Ctx } from "blitz"
import zaboInit from "app/accounts/utils/zabo-init"
import {
  createMultipleHoldingsAccount,
  createSingleHoldingAccount,
} from "app/accounts/utils/create"
import db from "db"

//- TODO: invention of control

export default async function createAccount({ data }, ctx: Ctx) {
  ctx.session.authorize()

  const zabo = await zaboInit()

  const { zaboUser, ...accountDataRaw } = data
  const { accountType, ...accountData } = accountDataRaw

  console.log("Zabo User")
  console.log(zaboUser)

  const zaboUserObj = (await (zaboUser !== null))
    ? await zabo.users.addAccount(zaboUser, accountData)
    : await zabo.users.create(accountData)

  console.log("Zabo user object")
  console.log(zaboUserObj)

  if (data.balances.length > 1) {
    const { account } = await createMultipleHoldingsAccount(
      accountData,
      zaboUserObj,
      ctx,
      accountType
    )

    console.log("SubAccount created!!")
    console.log(account)

    await db.user.update({
      where: { id: account.userId },
      data: { zaboUserObj },
    })

    return account
  } else {
    const account = await createSingleHoldingAccount(accountData, zaboUserObj, ctx, accountType)

    console.log("Account created!!")
    console.log(account)

    await db.user.update({
      where: { id: account.userId },
      data: { zaboUserObj },
    })

    return account
  }
}
