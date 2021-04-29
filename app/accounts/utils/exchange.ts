import axios from "axios"

const memo = (callback) => {
  const cache = new Map()
  return (...args) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)
    const value = callback(...args)
    cache.set(key, value)
    return value
  }
}

const memoizedAxiosGet = memo(axios.get)

export const toFiat = async (cryptoString, fiatCurrency = "USD") => {
  try {
    const { data } = await memoizedAxiosGet(
      `https://api.nomics.com/v1/currencies/ticker?key=${process.env.NEXT_PUBLIC_NOMICS_API_KEY}&ids=${cryptoString}&interval=1d&convert=${fiatCurrency}`
    )

    return data
  } catch (e) {
    console.log("Something went wrong!")
    console.log(e)
  }
}
