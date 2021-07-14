import { Ctx } from "blitz"
import zaboInit from "app/accounts/utils/zabo-init"
import {
  createMultipleHoldingsAccount,
  createSingleHoldingAccount,
} from "app/accounts/utils/create"
import db from "db"
import { compareArrayObjects } from "utils/utils"

//- TODO: invention of control
//- Generate everything and make the saving logic here not in another file.

export default async function createAccount({ data }, ctx: Ctx) {
  ctx.session.$authorize()

  const zabo = await zaboInit()
  const { userId } = ctx.session

  const { zaboUser, ...accountDataRaw } = data
  const { accountType, ...accountData } = accountDataRaw

  const zaboUserObj =
    zaboUser !== null && !!zaboUser
      ? await zabo.users.addAccount(zaboUser, accountData)
      : await zabo.users.create(accountData)

  const zaboObj = compareArrayObjects(zaboUser, zaboUserObj)

  const zaboAccountId = Array.isArray(zaboObj?.accounts) ? zaboObj.accounts[0].id : zaboObj.id

  const { account } =
    data.balances.length > 1
      ? await createMultipleHoldingsAccount(accountData, zaboAccountId, userId, accountType)
      : await createSingleHoldingAccount(accountData, zaboAccountId, userId, accountType)

  const user = await db.user.update({
    where: { id: account.userId },
    data: { zaboUserObj },
  })

  return account
}
