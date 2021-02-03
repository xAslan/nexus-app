import { Ctx } from "blitz"
import zaboInit from "app/accounts/utils/zabo-init"
import {
  createMultipleHoldingsAccount,
  createSingleHoldingAccount,
} from "app/accounts/utils/create"
import db from "db"
import { addedDiff } from "deep-object-diff"
import { compareArrayObjects } from "utils/utils"
import inspect from "object-inspect"

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

  const addedZaboObject = addedDiff(zaboUser?.accounts!, zaboUserObj.accounts)

  const comparedObjs = compareArrayObjects(zaboUser, zaboUserObj)
  console.log("Compared OBjcts")
  console.log(comparedObjs)

  //- Taking zaboObject in {...data} or { {...data} } form.
  // const zaboObjToUse = addedZaboObject[Object.keys(addedZaboObject)[0]] ?? zaboUserObj

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
