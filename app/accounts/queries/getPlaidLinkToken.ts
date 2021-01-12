import { Ctx } from "blitz"
import db, { Prisma } from "db"
import plaid from "plaid"

export default async function getPlaidLinkToken(input: any, ctx: Ctx) {
  ctx.session.authorize()

  const client = new plaid.Client({
    clientID: process.env.PLAID_CLIENT_ID,
    secret: process.env.PLAID_SECRET,
    env: plaid.environments.sandbox,
  })

  const clientUserId = ctx.session.userId
  const tokenResponse = await client.createLinkToken({
    user: {
      client_user_id: clientUserId,
    },
    client_name: "Nexus Finance",
    products: ["transactions"],
    country_codes: ["US", "GB"],
    language: "en",
    webhook: "https://webhook.sample.com",
  })

  return tokenResponse.link_token
}
