import { Prisma } from "db"

export type CreateHoldingInput = Pick<Prisma.HoldingCreateArgs, "data">
export type CreateAccountInput = Pick<Prisma.AccountCreateArgs, "data">

export function holdingsConstructor(data, currentBalance): CreateHoldingInput {
  return {
    holdings: {
      create: {
        amount: Number.parseFloat(currentBalance.balance),
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
  accountIdx = 0,
  accountType
): CreateAccountInput {
  console.log("Zabo user")
  console.log(zaboObj)

  console.log("Zabo user ID")
  console.log(
    zaboObj.accounts[zaboObj.accounts.length < 0 ? accountIdx : zaboObj.accounts.length - 1]["id"]
  )

  return {
    name: data.provider.display_name,
    type: accountType,
    zaboToken: data?.token!,
    zaboAccountId:
      zaboObj.accounts[zaboObj.accounts.length < 0 ? accountIdx : zaboObj.accounts.length - 1][
        "id"
      ],
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
