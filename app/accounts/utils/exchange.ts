import axios from "axios"

export const toFiat = async (balances, fiatCurrency) => {
  try {
    const cryptoCurrString = balanceToStr(balances)

    console.log("Cryptoz")

    console.log(cryptoCurrString)

    const { data } = await axios.get(
      `https://api.nomics.com/v1/currencies/ticker?key=${process.env.NEXT_PUBLIC_NOMICS_API_KEY}&ids=${cryptoCurrString}&interval=1d&convert=${fiatCurrency}`
    )

    // const fiatBalance = data.price * amount

    console.log("Data ...")
    console.log(data)

    // console.log("AmouNT")
    // console.log(fiatBalance)
  } catch (e) {
    console.log("Something went wrong!")
    console.log(e)
  }
}

const balanceToStr = (balances = []) => {
  if (Array.isArray(balances)) {
    return balances.reduce((acc, balanceObj) => {
      return acc.concat(`${balanceObj.currency},`)
    }, "")
  }
}
