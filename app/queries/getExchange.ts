import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import { getExchanges, getFiatExchange } from "app/accounts/utils/exchange"

const GetExchange = z.object({ type: z.string().optional() })

export default resolver.pipe(resolver.zod(GetExchange), async (input) => {
  if (input.type === "FIAT") {
    const cache = await getFiatExchange()
    return cache.get("fiatExchanges")
  }

  const cache = await getExchanges()
  return cache.get("exchanges")
})
