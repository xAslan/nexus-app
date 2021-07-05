import Plaid from "plaid"

//TODO: Change to Plaid.environments.production after you've gone live
//TODO Change all other references to PLAID_PROD which actually refer to DEV

export default function plaidInit() {
  const plaidEnvConfig = {
    clientID: process.env.PLAID_CLIENT_ID,

    secret:
      process.env.APP_ENV === "production"
        ? process.env.PLAID_PROD_SECRET
        : process.env.APP_ENV === "development"
        ? process.env.PLAID_DEV_SECRET //- Use production secret/dev/sandbox
        : process.env.PLAID_SANDBOX_SECRET, //- Use production secret/dev/sandbox

    env:
      process.env.APP_ENV === "production"
        ? Plaid.environments.development
        : process.env.APP_ENV === "development"
        ? Plaid.environments.development
        : Plaid.environments.sandbox, //- Sandbox, dev, production
  }

  const client = new Plaid.Client(plaidEnvConfig)

  return client
}
