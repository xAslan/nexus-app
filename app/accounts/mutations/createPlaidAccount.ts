import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import Plaid from "plaid"
import inspect from "object-inspect"
import { createSinglePlaidAccount, createMultipleSubAccounts } from "app/accounts/utils/create"
import { promisify } from "utils/utils"
import plaidClientInit from "app/accounts/utils/plaid-init"

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

      return accountResponse
    } catch (err) {
      console.error(err)
      console.log(err.stack)
    }
  }
)
