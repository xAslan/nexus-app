import { CronJob } from "quirrel/blitz"
import { getExchanges } from "app/accounts/utils/exchange"

export default CronJob(
  "api/exchangesCron",
  "0 */1 * * *", //- After every 1 hours
  async (job) => {
    await getExchanges()
  }
)
