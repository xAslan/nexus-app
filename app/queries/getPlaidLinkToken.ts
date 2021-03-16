import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import Plaid from "plaid"

const GetPlaidLinkToken = z.object({
  id: z.number(),
})

const client = new Plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SANDBOX_SECRET,
  env: Plaid.environments.sandbox,
})

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
