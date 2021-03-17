import { Ctx } from "blitz"
import zaboInit from "app/accounts/utils/zabo-init"
import {
  createMultipleHoldingsAccount,
  createSingleHoldingAccount,
} from "app/accounts/utils/create"
import db from "db"
import { compareArrayObjects } from "utils/utils"
import inspect from "object-inspect"

//- TODO: invention of control
//- Generate everything and make the saving logic here not in another file.

export default async function createAccount({ data }, ctx: Ctx) {
  ctx.session.$authorize()

  const zabo = await zaboInit()

  const { zaboUser, ...accountDataRaw } = data
  const { accountType, ...accountData } = accountDataRaw

  const zaboUserObj =
    zaboUser !== null && !!zaboUser
      ? await zabo.users.addAccount(zaboUser, accountData)
      : await zabo.users.create(accountData)

  const comparedObjs = compareArrayObjects(zaboUser, zaboUserObj)

  //- Expecting to return {...all stuff, fiatAmount}
  // toFiat(accountData.balances, "USD")

  const { account } =
    data.balances.length > 1
      ? await createMultipleHoldingsAccount(accountData, comparedObjs, ctx, accountType)
      : await createSingleHoldingAccount(accountData, comparedObjs, ctx, accountType)

  await db.user.update({
    where: { id: account.userId },
    data: { zaboUserObj },
  })

  return account
}
