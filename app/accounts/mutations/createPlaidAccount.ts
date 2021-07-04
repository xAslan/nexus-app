import { resolver } from "blitz"
import * as z from "zod"
import { createSinglePlaidAccount, createMultipleSubAccounts } from "app/accounts/utils/create"
import plaidClientInit from "app/accounts/utils/plaid-init"
import saveTrx from "app/transactions/utils/createPlaidTrx"
import balanceCron from "app/api/balanceCron"

const plaidClient = plaidClientInit()

const getInstitutionsPromise = (institutionId, countryCodes) => {
  return new Promise((resolve, reject) => {
    plaidClient.getInstitutionById(institutionId, countryCodes, (err, institution) => {
      if (err != null) {
        reject(err)
      }

      resolve(institution)
    })
  })
}

const getAccountsPromise = (token) => {
  return new Promise((resolve, reject) => {
    plaidClient.getAccounts(token, (err, accountsData) => {
      if (err != null) {
        reject(err)
      }

      resolve(accountsData)
    })
  })
}

const CreatePlaidAccount = z
  .object({
    accessToken: z.string(),
    accountType: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(CreatePlaidAccount),
  resolver.authorize(),
  async (input, ctx) => {
    const { userId } = ctx.session
    const { accessToken, accountType } = input
    const countryCodes = ["US", "GB"]

    try {
      const accountsResponse = await getAccountsPromise(accessToken)

      const institutionId = accountsResponse.item.institution_id
      const institutionResponse = await getInstitutionsPromise(institutionId, countryCodes)

      const newAccountsObject = {
        ...accountsResponse,
        institution: institutionResponse.institution,
      }

      const accountResponse =
        accountsResponse.accounts.length > 1
          ? await createMultipleSubAccounts(newAccountsObject, userId, accountType)
          : await createSinglePlaidAccount(newAccountsObject, userId, accountType)

      const accountIds = accountResponse.subAccounts.map((curr) => {
        return curr.clientAccountId
      })

      const { transactions } = await plaidClient.getTransactions(
        accessToken,
        "2018-01-01",
        "2021-06-01",
        { account_ids: accountIds }
      )

      await saveTrx(transactions, accountResponse.id)

      if (process.env.APP_ENV === "production") {
        await balanceCron.enqueue(accountResponse.id, {
          repeat: {
            cron: "0 */12 * * *",
          },
        })
      } else {
        await balanceCron.enqueue(accountResponse.id, {
          repeat: {
            cron: "*/3 * * * *",
          },
        })
      }

      return accountResponse
    } catch (err) {
      console.error(err)
      console.log(err.stack)
    }
  }
)
