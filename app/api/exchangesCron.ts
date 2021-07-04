import { CronJob } from "quirrel/blitz"
import { getExchanges } from "app/accounts/utils/exchange"

export default CronJob(
  "api/exchangesCron",
  `${process.env.APP_ENV === "staging" ? "* * * * *" : "*/5 * * * *"}`,
  async (job) => {
    await getExchanges()
  }
)
