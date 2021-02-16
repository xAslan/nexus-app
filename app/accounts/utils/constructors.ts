import { Prisma } from "db"

export type CreateHoldingInput = Pick<Prisma.HoldingCreateArgs, "data">
export type CreateAccountInput = Pick<Prisma.AccountCreateArgs, "data">

export function holdingsConstructor(data, currentBalance, fiatBalance = 0): CreateHoldingInput {
  return {
    holdings: {
      create: {
        amount: Number.parseFloat(currentBalance.balance),
        fiatAmount: Number.parseFloat(currentBalance.fiat_value) || 0,
        asset: {
          connectOrCreate: {
            where: {
              symbolAddress: {
                symbol: currentBalance.currency,
                address: "0",
              },
            },
            create: {
              symbol: currentBalance.currency,
              name: currentBalance.provider_currency,
            },
          },
        },
      },
    },
  }
}

export function accountObjConstructor(
  data,
  zaboObj,
  ctx,
  currentBalance,
  accountType
): CreateAccountInput {
  return {
    name: data.provider.display_name,
    type: accountType,
    zaboToken: data?.token!,
    zaboAccountId: zaboObj.id,
    wallet: {
      create: {
        symbol: currentBalance.currency,
      },
    },
    subAccounts: {
      create: {
        name: data.provider.display_name,
        holdings: {
          create: {
            amount: Number.parseFloat(currentBalance.balance),
            fiatAmount: Number.parseFloat(currentBalance.fiat_value) || 0,
            asset: {
              connectOrCreate: {
                where: {
                  symbolAddress: {
                    symbol: currentBalance.currency,
                    address: "0",
                  },
                },
                create: {
                  symbol: currentBalance.currency,
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
