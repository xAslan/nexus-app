import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import Plaid from "plaid"
import inspect from "object-inspect"
import { createSinglePlaidAccount, createMultipleSubAccounts } from "app/accounts/utils/create"
import { promisify } from "utils/utils"

const client = new Plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SANDBOX_SECRET,
  env: Plaid.environments.sandbox,
})

const getInstitutionsPromise = (institutionId, countryCodes) => {
  return new Promise((resolve, reject) => {
    client.getInstitutionById(institutionId, countryCodes, (err, institution) => {
      if (err != null) {
        reject(err)
      }

      resolve(institution)
    })
  })
}

const getAccountsPromise = (token) => {
  return new Promise((resolve, reject) => {
    client.getAccounts(token, (err, accountsData) => {
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
    const userId = ctx.session.userId
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
          ? await createMultipleSubAccounts(newAccountsObject, ctx, accountType)
          : await createSinglePlaidAccount(newAccountsObject, ctx, accountType)

      return accountResponse
    } catch (err) {
      console.error(err)
      console.log(err.stack)
    }
  }
)
