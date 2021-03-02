import { Prisma } from "db"

export function holdingsConstructor(data, currentBalance) {
  console.log("Current balance object holdings")
  console.log(currentBalance)
  return {
    holdings: {
      create: {
        amount: Number.parseFloat(currentBalance.amount),
        fiatAmount: Number.parseFloat(currentBalance.fiat_value) || 0,
        asset: {
          connectOrCreate: {
            where: {
              symbolAddress: {
                symbol: currentBalance.ticker,
                address: "0",
              },
            },
            create: {
              symbol: currentBalance.ticker,
              name: currentBalance.provider_ticker,
            },
          },
        },
      },
    },
  }
}

export function accountObjConstructor(data, zaboObj, ctx, currentBalance, accountType) {
  return {
    name: data.provider.display_name,
    type: accountType,
    zaboToken: data?.token!,
    zaboAccountId: zaboObj.id,
    wallet: {
      create: {
        symbol: currentBalance.ticker,
      },
    },
    subAccounts: {
      create: {
        name: data.provider.display_name,
        holdings: {
          create: {
            amount: Number.parseFloat(currentBalance.amount),
            fiatAmount: Number.parseFloat(currentBalance.fiat_value) || 0,
            asset: {
              connectOrCreate: {
                where: {
                  symbolAddress: {
                    symbol: currentBalance.ticker,
                    address: "0",
                  },
                },
                create: {
                  symbol: currentBalance.ticker,
                  name: data.provider.name,
                },
              },
            },
          },
        },
      },
    },
    institution: {
      connectOrCreate: {
        where: {
          shortName: data.provider.name,
        },
        create: {
          name: data.provider.display_name,
          shortName: data.provider.name,
          type: accountType,
          logoURL: data.provider.logo,
        },
      },
    },
    user: {
      connect: {
        id: ctx.session.userId,
      },
    },
  }
}
