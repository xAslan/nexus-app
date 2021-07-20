import axios from "axios"
import moment from "moment"

interface callAndCacheProps {
  requestURL: string
  cacheTimeLabel: string
  cacheDataLabel: string
}

const callAndCache = async ({ requestURL, cacheTimeLabel, cacheDataLabel }: callAndCacheProps) => {
  try {
    const res = await axios(requestURL)

    if (res.status === 200) {
      global.cache.set(cacheTimeLabel, new Date())
      global.cache.set(cacheDataLabel, res.data)
      return global.cache
    }

    console.log(`Error on Exchange API: ${cacheDataLabel}`)
    throw err
  } catch (err) {
    console.log(`Error Querying: ${cacheDataLabel}`)
    throw err
  }
}

interface exchangesFnProps {
  requestURL: string
  cacheTimeLabel: string
  cacheDataLabel: string
  cacheTime: number
  cacheTimeSIUnit: string
}

const exchangesFn = async ({
  cacheTimeLabel,
  cacheDataLabel,
  cacheTime,
  cacheTimeSIUnit,
  requestURL,
}: exchangesFnProps) => {
  global.cache ??= new Map()

  if (typeof global.cache !== "undefined" && global.cache.size > 0) {
    const exchangesData = global.cache.get(cacheDataLabel) || []
    const cacheLifeTime = moment(global.cache.get(cacheTimeLabel))
    const cacheExpiryTime = moment().subtract(cacheTime, cacheTimeSIUnit)

    if (exchangesData.length > 0 && cacheLifeTime.isAfter(cacheExpiryTime)) {
      console.log("From Cache...")
      return global.cache
    }

    console.log("Cache Expired...")
    return await callAndCache({
      cacheTimeLabel,
      cacheDataLabel,
      requestURL,
    })
  }

  console.log("No Cache Found ...")
  return await callAndCache({
    cacheTimeLabel,
    cacheDataLabel,
    requestURL,
  })
}

export const getExchanges = async (fiatCurrency = "USD") => {
  const cacheDataLabel = "exchanges"
  const cacheTimeLabel = "cacheTime"
  const requestURL = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.NEXT_PUBLIC_NOMICS_API_KEY}&interval=1h&convert=${fiatCurrency}&status=active`
  const cacheTime = 60
  const cacheTimeSIUnit = "minutes"

  return await exchangesFn({
    cacheDataLabel,
    cacheTimeLabel,
    cacheTime,
    cacheTimeSIUnit,
    requestURL,
  })
}

export const getFiatExchange = async () => {
  const cacheDataLabel = "fiatExchanges"
  const cacheTimeLabel = "fiatCacheTime"
  const baseURL = "https://openexchangerates.org/api/"
  const requestURL = `${baseURL}latest.json?app_id=${process.env.OPEN_EXCHANGES_DEV_APP_ID}`
  const cacheTime = 6
  const cacheTimeSIUnit = "hours"

  return await exchangesFn({
    cacheDataLabel,
    cacheTimeLabel,
    cacheTime,
    cacheTimeSIUnit,
    requestURL,
  })
}
