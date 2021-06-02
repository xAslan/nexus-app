import Plaid from "plaid"

export default function plaidInit() {
  console.log("Initializinng Plaid")
  console.log("Current Node Enviroment")
  console.log(process.env.NODE_ENV)

  const someVar = {
    clientID: process.env.PLAID_CLIENT_ID,

    secret:
      process.env.NODE_ENV === "production"
        ? process.env.PLAID_PROD_SECRET
        : process.env.NODE_ENV === "development"
        ? process.env.PLAID_DEV_SECRET //- Use production secret/dev/sandbox
        : process.env.PLAID_SANDBOX_SECRET, //- Use production secret/dev/sandbox

    env:
      process.env.NODE_ENV === "production"
        ? Plaid.environments.production
        : process.env.NODE_ENV === "development"
        ? Plaid.environments.development
        : Plaid.environments.sandbox, //- Sandbox, dev, production
  }

  const client = new Plaid.Client(someVar)

  return client
}
