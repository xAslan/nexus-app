import db from "db"
import { CronJob } from "quirrel/blitz"
import { syncAllUserAccounts } from "app/accounts/utils/accountSync"

export default CronJob(
  "api/balanceCron",
  "0 5 */1 * *", //- everyday at 5 AM
  async (job) => {
    const allUsers = await db.user.findMany({ include: { accounts: true } })
    const users = allUsers.filter((user) => user.accounts.length > 0)

    await users.forEach(async ({ id }) => {
      await syncAllUserAccounts(id)
    })

    console.log("Done syncing all accounts ...")
  }
)
