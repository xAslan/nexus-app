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
    const parties = trxObj.category

    const trxType =
      trxObj.transaction_type === "unresolved" ? "OTHER" : trxObj.transaction_type.toUpperCase()
    const confirmedAt = trxObj.authorized_date
      ? new Date(trxObj.authorized_date)
      : new Date(trxObj.date)

    return {
      id: trxObj.transaction_id,
      account: {
        connect: {
          id: accountId,
        },
      },
      amountSent: trxObj.amount,
      currencySent: trxObj.iso_currency_code,
      trxType,
      parties,
      confirmedAt,
    }
  })
}
