import { resolver } from "blitz"
import db from "db"
import * as z from "zod"
import Plaid from "plaid"

const client = new Plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SANDBOX_SECRET,
  env: Plaid.environments.sandbox,
})

const getAccessToken = (publicToken) => {
  return new Promise((resolve, reject) => {
    client.exchangePublicToken(publicToken, (err, token) => {
      if (err != null) {
        reject(err)
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

//- Checks to see if there is accessToken & returns it

//- Otherwise

//- Creates the access token & save it

export default resolver.pipe(
  resolver.zod(SetAccessToken),
  resolver.authorize(),
  async (input, ctx) => {
    const userId = ctx.session.userId
    const PUBLIC_TOKEN = input.token

    /*
     * Returning same token on requests gives same
     * Bank information for every new request.
     *
    const userObject = await db.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        plaidToken: true,
      },
    })

    if (userObject.plaidToken != null) {
      return userObject.plaidToken
    }
    */

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

      return access_token
    } catch (err) {
      console.log("Something webt wronnggg")
      console.error(err)
    }
  }
)
