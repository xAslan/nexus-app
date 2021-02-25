import { Ctx } from "blitz"
import db from "db"
// import { wait } from "utils/utils"
import Zabo from "zabo-sdk-js"
//import updateAccount from "./updateAccount"
//const { spawn } = require('child_process')
// var ccxt = require("ccxt")

type SyncAccountInput = {
  accountId: number
  lastSync: Date
}
export default async function syncAccount({ accountId, lastSync }: SyncAccountInput, ctx: Ctx) {
  const account = await db.account.findUnique({
    where: { id: accountId },
    include: { institution: true },
  })

  const zabo = await Zabo.init({
    apiKey: process.env.ZABO_API_KEY,
    secretKey: process.env.ZABO_SECRET,
    env: "sandbox",
  })

  console.log(zabo.getTeam())
  console.log(account)

  //const institution = account?.institution
  //if (!account) throw new Error("no account found with account id")
  //if (!institution)
  //  throw new Error("Account cannot be synced because it has no institution to sync to")
  //if (institution.authType == "api" && (!account?.apiKey || !account?.apiSecret))
  //  throw new Error("No API Credentials")
  //ctx.session.authorize()
  //let holdings = []
  ////spawn('./syncAccount', 'cats') spawn child process to update account
  //const exchangeId = institution.shortName,
  //  exchangeClass = ccxt[exchangeId],
  //  exchange = new exchangeClass({
  //    apiKey: account.apiKey,
  //    secret: account.apiSecret,
  //    timeout: 30000,
  //    enableRateLimit: true,
  //  })
  // const balance = await exchange.fetchBalance({ params: {} })
  // const trades = await exchange.fetchMyTrades("BNB/BNB")
  // const uniqueTrades = await [...new Map(trades.map(transObj => [transObj["side"], transObj])).values()]

  // console.log(trades)

  // const newBal = Object.fromEntries(
  //   Object.entries(balance["total"]).filter(([key, value]) => value > 0)
  // )

  // Object.keys(newBal).forEach((symbol) => {
  //   let holding = { name: "holdingName", symbol, amount: parseFloat(newBal[symbol]) }
  //   let holdingUpsert = {
  //     create: holding,
  //     update: holding,
  //     where: { symbol_accountId: { symbol, accountId: account.id } },
  //   }
  //   holdings.push(holdingUpsert)
  //   console.log(holdingUpsert)
  // })
  // console.log("start timer")
  // wait(1000)
  // console.log("end timer")
  // console.log(holdings)
  // const updated_account = await db.account.update({
  //   where: { id: account.id },
  //   data: {
  //     lastSync,
  //     lastSyncEnd: new Date(),
  //     syncStatus: "inactive",
  //     holdings: { upsert: holdings },
  //   },
  //   include: { holdings: true },
  // })
  // return updated_account
}

/*export function syncAccountJob (hello) {

    console.log('child process', hello)
}*/
