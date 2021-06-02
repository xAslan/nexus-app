import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import plaidClientInit from "app/accounts/utils/plaid-init"

const plaidClient = plaidClientInit()

const getAccessToken = (publicToken) => {
  return new Promise((resolve, reject) => {
    plaidClient.exchangePublicToken(publicToken, (err, token) => {
      if (err != null) {
        reject(err)
        console.log(err)
      }

      resolve(token)
    })
  })
}

const SetAccessToken = z
  .object({
    token: z.string(),
  })
  .nonstrict()

export default resolver.pipe(
  resolver.zod(SetAccessToken),
  resolver.authorize(),
  async (input, ctx) => {
    const userId = ctx.session.userId
    const PUBLIC_TOKEN = input.token

    try {
      const { access_token } = await getAccessToken(PUBLIC_TOKEN)

      const updatedUser = await db.user.update({
        where: {
          id: ctx.session.userId,
        },
        data: {
          plaidToken: access_token,
        },
      })

      console.log("Access Token")
      console.log(access_token)

      return access_token
    } catch (err) {
      console.error(err)
    }
  }
)
