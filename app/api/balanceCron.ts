import { Queue } from "quirrel/blitz"
import db from "db"
import {
  getAssetsAmounts as getAccountAssetsAmount,
  getFiatAmounts as getAccountFiats,
} from "app/accounts/utils/getAccountSums"
import moment from "moment"

export default Queue("api/balanceCron", async (accountId: number) => {
  //- Get account
  try {
    const account = await db.account.findFirst({
      where: { id: accountId },
      include: {
        institution: true,
        subAccounts: { include: { holdings: { include: { asset: true } } } },
      },
    })

    //- Get the current assets from zabo/plaid first

    const accountsSums = await getAccountAssetsAmount(account)
    const accountFiats = await getAccountFiats(accountsSums)
    const date = moment().format("YYYY-MM-DD")

    const balance = await db.balance.upsert({
      where: {
        dateAccountIdBalance: {
          accountId,
          balanceDate: date,
        },
      },
      update: {
        amount: accountFiats.holdingsSum,
      },
      create: {
        amount: accountFiats.holdingsSum,
        balanceDate: date,
        account: {
          connect: {
            id: accountId,
          },
        },
      },
    })
  } catch (err) {
    console.log("Create Balance error")
    console.error(err)
  }
})
