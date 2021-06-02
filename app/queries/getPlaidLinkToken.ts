import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import plaidInit from "app/accounts/utils/plaid-init"

const GetPlaidLinkToken = z.object({
  id: z.number(),
})

const client = plaidInit()

export default resolver.pipe(resolver.authorize(), async (input, { session }) => {
  const clientUserId = session.userId
  const tokenResponse = await client.createLinkToken({
    user: {
      client_user_id: clientUserId.toString(),
    },
    client_name: "Nexus Finance",
    products: ["transactions"],
    country_codes: ["US", "GB"],
    language: "en",
    webhook: "https://webhook.sample.com",
  })

  return tokenResponse.link_token
})
