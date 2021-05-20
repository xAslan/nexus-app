import axios from "axios"
import moment from "moment"
import exchangeCron from "app/api/exchangesCron"

export const getExchanges = async (fiatCurrency = "USD") => {
  try {
    global.cache ??= new Map()

    const { data } = await axios(
      `https://api.nomics.com/v1/exchange-rates?key=${process.env.NEXT_PUBLIC_NOMICS_API_KEY}`
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

export const toFiat = async (cryptoString, fiatCurrency = "USD") => {
  try {
    const data = global.cache.get("exchanges")

    return data
  } catch (e) {
    console.log("Error Fetching Fiats")
    console.log(e)
    throw e
  }
}
