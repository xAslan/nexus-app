import { Ctx } from "blitz"
import zaboInit from "app/accounts/utils/zabo-init"
import {
  createMultipleHoldingsAccount,
  createSingleHoldingAccount,
} from "app/accounts/utils/create"
import db from "db"
import { compareArrayObjects } from "utils/utils"
import inspect from "object-inspect"
import { toFiat } from "app/accounts/utils/exchange"

//- TODO: invention of control
//- Generate everything and make the saving logic here not in another file.

export default async function createAccount({ data }, ctx: Ctx) {
  ctx.session.authorize()

  const zabo = await zaboInit()

  const { zaboUser, ...accountDataRaw } = data
  const { accountType, ...accountData } = accountDataRaw

  console.log("Zabo Old User Obje")
  console.log(inspect(zaboUser))

  const zaboUserObj = (await (zaboUser !== null))
    ? await zabo.users.addAccount(zaboUser, accountData)
    : await zabo.users.create(accountData)

  console.log("Zabo New user object")
  console.log(inspect(zaboUserObj))

  const comparedObjs = compareArrayObjects(zaboUser, zaboUserObj)
  console.log("Compared OBjcts")
  console.log(comparedObjs)

  //- Expecting to return {...all stuff, fiatAmount}
  toFiat(accountData.balances, "USD")

  if (data.balances.length > 1) {
    const { account } = await createMultipleHoldingsAccount(
      accountData,
      comparedObjs,
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
    const account = await createSingleHoldingAccount(accountData, comparedObjs, ctx, accountType)

    console.log("Account created!!")
    console.log(account)

    await db.user.update({
      where: { id: account.userId },
      data: { zaboUserObj },
    })

    return account
  }
}
