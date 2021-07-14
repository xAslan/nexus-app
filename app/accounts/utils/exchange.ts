import axios from "axios"
import moment from "moment"
import exchangeCron from "app/api/exchangesCron"

export const getExchanges = async (fiatCurrency = "USD") => {
  try {
    global.cache ??= new Map()

    const { data } = await axios(
      `https://api.nomics.com/v1/currencies/ticker?key=${process.env.NEXT_PUBLIC_NOMICS_API_KEY}&interval=1d&convert=${fiatCurrency}&status=active`
    )

    global.cache.set("cacheTime", new Date())
    global.cache.set("exchanges", data)
    return cache
  } catch (err) {
    console.log("Error on nomics API")
    console.log(err)
    throw err
  }
}

export const getCachedExchange = () => global.cache.get("exchanges")
