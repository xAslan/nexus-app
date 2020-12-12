import { Ctx } from "blitz"
import db, { HoldingCreateArgs } from "db"
import { Account, HoldingCreateInput } from "@prisma/client"
import { wait } from "utils/utils"
import { string } from "zod"
//import updateAccount from "./updateAccount"
//const { spawn } = require('child_process')
var ccxt = require("ccxt")

type SyncAccountInput = {
  accountId: number
  lastSync: Date
}
export default async function syncAccount({ accountId, lastSync }: SyncAccountInput, ctx: Ctx) {
  //const institution = await db.institution.findOne({where: { id : account.institutionId }})
  const account = await db.account.findOne({
    where: { id: accountId },
    include: { institution: true },
  })

  const institution = account?.institution
  if (!institution)
    throw new Error("Account cannot be synced because it has no institution to sync to")
  if (institution.authType == "api" && (!account?.apiKey || !account?.apiSecret))
    throw new Error("No API Credentials")
  ctx.session.authorize()
  let holdings = []
  //spawn('./syncAccount', 'cats') spawn child process to update account
  const exchangeId = institution.shortName,
    exchangeClass = ccxt[exchangeId],
    exchange = new exchangeClass({
      apiKey: account.apiKey,
      secret: account.apiSecret,
      timeout: 30000,
      enableRateLimit: true,
    })
  const balance = await exchange.fetchBalance({ params: {} })

  const newBal = Object.fromEntries(
    Object.entries(balance["total"]).filter(([key, value]) => value > 0)
  )
  console.log(balance["info"])

  Object.keys(newBal).forEach((symbol) => {
    let holding = { name: "holdingName", symbol, amount: parseFloat(newBal[symbol]) }
    let holdingUpsert = { create: holding, update: holding, where: { symbol } }
    holdings.push(holdingUpsert)
    console.log(holdingUpsert)
  })
  console.log("start timer")
  wait(1000)
  console.log("end timer")
  console.log(holdings)
  const updated_account = await db.account.update({
    where: { id: account.id },
    data: {
      lastSync,
      lastSyncEnd: new Date(),
      syncStatus: "inactive",
      holdings: { upsert: holdings },
    },
    include: { holdings: true },
  })
  return updated_account
}

/*export function syncAccountJob (hello) {

    console.log('child process', hello)
}*/
