import { Prisma } from "db"

export function subAccountsConstructor(currentAccount) {
  return {
    subAccounts: {
      create: {
        name: currentAccount.official_name || currentAccount.name,
        clientAccountId: currentAccount.account_id,
        holdings: {
          create: {
            amount: Number.parseFloat(currentAccount.balances.current),
            fiatAmount: Number.parseFloat(currentAccount.balances.available) || 0,
            asset: {
              connectOrCreate: {
                where: {
                  symbolAddress: {
                    symbol: currentAccount.balances.iso_currency_code,
                    address: "0",
                  },
                },
                create: {
                  symbol: currentAccount.balances.iso_currency_code,
                  name: currentAccount.balances.iso_currency_code,
                },
              },
            },
          },
        },
      },
    },
  }
}

export function accountsConstructor(data, ctx, currentAccount, accountType) {
  return {
    name: data.institution.name,
    type: accountType,
    plaidItemId: data.item.item_id,
    wallet: {
      create: {
        symbol: currentAccount.balances.iso_currency_code,
      },
    },
    subAccounts: {
      create: {
        name: currentAccount.official_name || currentAccount.name,
        clientAccountId: currentAccount.account_id,
        holdings: {
          create: {
            amount: Number.parseFloat(currentAccount.balances.current),
            fiatAmount: Number.parseFloat(currentAccount.balances.available) || 0,
            asset: {
              connectOrCreate: {
                where: {
                  symbolAddress: {
                    symbol: currentAccount.balances.iso_currency_code,
                    address: "0",
                  },
                },
                create: {
                  symbol: currentAccount.balances.iso_currency_code,
                  name: currentAccount.balances.iso_currency_code,
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
          shortName: data.institution.institution_id,
        },
        create: {
          name: data.institution.name,
          shortName: data.institution.institution_id,
          type: accountType,
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
