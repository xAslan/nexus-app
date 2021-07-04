import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import { getExchanges } from "app/accounts/utils/exchange"

const GetExchange = z.object({})

export default resolver.pipe(resolver.zod(GetExchange), async (input) => {
  if (typeof global.cache !== "undefined" && global.cache.size > 0) {
    return global.cache.get("exchanges")
  }

  const cache = await getExchanges()
  return cache.get("exchanges")
})
