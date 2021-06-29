import { Prisma } from "db"

export function holdingsConstructor(data, currentBalance, assetType = "CRYPTO") {
  return {
    holdings: {
      create: {
        amount: Number.parseFloat(currentBalance.amount),
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
              type: assetType,
            },
          },
        },
      },
    },
  }
}

export function accountObjConstructor(
  data,
  zaboAccountId,
  userId,
  currentBalance,
  accountType,
  assetType = "CRYPTO"
) {
  return {
    name: data.provider.display_name,
    type: accountType,
    zaboToken: data?.token!,
    zaboAccountId,
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
                  type: assetType,
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
        id: userId,
      },
    },
  }
}
