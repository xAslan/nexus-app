import { accountTypes } from "app/accounts/utils/accountTypes"
import saveTrx from "app/transactions/utils/createPlaidTrx"
import storeTransactions from "app/transactions/utils/create"
import zaboInit from "app/accounts/utils/zabo-init"
import plaidClientInit from "app/accounts/utils/plaid-init"
import moment from "moment"

interface getTransactionsArgs {
  accountType: string
  lastSync: Date
  accountId: number
  plaidToken?: string
  accountIds?: string
  zaboUserId?: string
  zaboAccountId?: string
}

export default async function getTransactions({
  accountType,
  lastSync,
  plaidToken,
  accountIds,
  accountId,
  zaboUserId,
  zaboAccountId,
}: getTransactionsArgs) {
  try {
    if (accountType === accountTypes.TRADITIONAL_BANKS) {
      const plaidClient = plaidClientInit()
      const today = new Date()
      const startDate =
        lastSync === null
          ? normalizeDate(moment().subtract(3, "months").format())
          : normalizeDate(moment(lastSync).subtract(2, "weeks"))

      const endDate = normalizeDate(today)

      const { transactions } = await plaidClient.getTransactions(plaidToken, startDate, endDate, {
        account_ids: accountIds,
      })

      const trx = await saveTrx(transactions, accountId)

      return trx
    }

    const zabo = await zaboInit()

    const transactions = await zabo.transactions.getList({
      userId: zaboUserId,
      accountId: zaboAccountId,
    })

    const trx = await storeTransactions(transactions.data, accountId)

    return trx
  } catch (err) {
    throw err
  }
}

function normalizeDate(dateString) {
  const date = new Date(dateString)

  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, "0")
  const day = `${date.getDate()}`.padStart(2, "0")
  return [year, month, day].join("-")
}
