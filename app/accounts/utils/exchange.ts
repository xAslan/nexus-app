import axios from "axios"

export const toFiat = async (cryptoString, fiatCurrency = "USD") => {
  try {
    const { data } = await axios.get(
      `https://api.nomics.com/v1/currencies/ticker?key=${process.env.NEXT_PUBLIC_NOMICS_API_KEY}&ids=${cryptoString}&interval=1d&convert=${fiatCurrency}`
    )

    return data
  } catch (e) {
    console.log("Something went wrong!")
    console.log(e)
  }
}
