import { CronJob } from "quirrel/blitz"
import { getExchanges } from "app/accounts/utils/exchange"

export default CronJob(
  "api/exchangesCron",
  "0 */6 * * *", //- After every 6 hours
  async (job) => {
    await getExchanges()
  }
)
