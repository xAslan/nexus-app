import db from "db"

export default async function storeTransactions(trxArray, accountId) {
  const arrangedTrx = trxObjsConstructor(trxArray, accountId)
  const transactions = await createMultipleTrx(arrangedTrx)

  return transactions
}

const createMultipleTrx = async (trxArray) => {
  const transaction = await db.$transaction(
    trxArray.map((trxObj) => {
      return db.transaction.create({
        data: trxObj,
      })
    })
  )

  return await transaction
}

const trxObjsConstructor = (trxArray, accountId) => {
  return trxArray.map((trxObj) => {
    const partsObj = trxObj.parts.reduce((acc, curr) => {
      if (curr.direction === "sent") {
        const obj = {
          amountSent: Number.parseFloat(curr.fiat_value),
          currencySent: curr.ticker,
        }

        return { ...acc, ...obj }
      }

      const obj = {
        amountReceived: Number.parseFloat(curr.fiat_value),
        currencyReceived: curr.ticker,
      }

      return { ...acc, ...obj }
    }, {})

    const parties = trxObj.parts[0].other_parties

    const trxType = trxObj.transaction_type.toUpperCase()
    const confirmedAt = new Date(trxObj.confirmed_at)

    return {
      id: trxObj.id,
      account: {
        connect: {
          id: accountId,
        },
      },
      amountReceived: partsObj?.amountReceived! || 0,
      amountSent: partsObj?.amountSent! || 0,
      currencyReceived: partsObj?.currencyReceived!,
      currencySent: partsObj?.currencySent!,
      trxType,
      parties,
      confirmedAt,
    }
  })
}
