import { useRouter, invoke } from "blitz"
import { Skeleton, Input, List, Button, Row, Col, Card } from "antd"
import * as styled from "app/users/components/styles"
import { useAggregates } from "app/users/components/dashboardCtx"
import moment from "moment"
import { RefreshIcon } from "@heroicons/react/outline"
import _ from "lodash"
import toast, { Toaster } from "react-hot-toast"
import { accountTypes } from "app/accounts/utils/accountTypes"
import syncAccount from "app/accounts/mutations/syncAccount"

interface banksListProps {
  title?: string
  hasButton?: boolean
  renderAssets?: boolean
  account?: any
}

const BanksList = (props: banksListProps) => {
  const { holdings } = useAggregates()
  const router = useRouter()

  const handleSync = async (account) => {
    if (account.institution.type === accountTypes.TRADITIONAL_BANKS) {
      const syncResponse = await invoke(syncAccount, {
        token: account.user.plaidToken,
        accountType: account.institution.type,
        accountId: account.accountId,
      })

      console.log(syncResponse)
      toast.success("Sync Complete!")
    } else {
      const syncResponse = await invoke(syncAccount, {
        zaboAccountId: account.zaboAccId,
        accountId: account.accountId,
        userId: account.user.zaboUserObj.id,
        accountType: account.institution.type,
      })

      console.log(syncResponse)
      toast.success("Sync Complete!")
    }
  }

  const renderList = (holdings = []) => {
    const holdingsObjects = _.mapValues(
      _.groupBy(holdings, ({ accountId }) => accountId),
      (arr, keyIdx) => {
        const totalAmount = _.sumBy(arr, (account) => account.fiatAmount)
        return {
          accountId: arr[0]["accountId"],
          totalAmount,
          lastSync: arr[0]["lastSync"],
          accountName: arr[0]["institution"]["name"],
          account: arr[0],
        }
      }
    )

    const renderMultiple = (holdingsArray = [], renderAssets = false, holdings = []) => {
      if (renderAssets) {
        return (
          <div>
            <div className="flow-root mt-6">
              <ul className="-my-5 divide-y divide-gray-200">
                {holdings.map(({ asset, fiatAmount, amount }) => (
                  <li key={asset.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <p className="h-8 w-8 rounded-full">{asset.symbol}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate text-right">
                          {amount}
                        </p>
                        <p className="text-sm text-gray-500 truncate text-right">
                          {"$" + fiatAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      }

      return (
        <div>
          <div className="flow-root">
            <ul className="space-y-3">
              {holdingsArray.map(({ accountName, totalAmount, accountId, lastSync, account }) => (
                <li
                  key={accountId}
                  className="bg-white shadow overflow-hidden px-4 py-4 sm:px-6 sm:rounded-md space-y-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-md font-bold text-gray-900 truncate">{accountName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-900 truncate">Available Amount</p>
                    <p className="text-sm text-gray-500 truncate">
                      {"$" + totalAmount.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div class="flex justify-between">
                    <div>
                      <p>
                        Last Sync:{" "}
                        {lastSync ? moment(lastSync).startOf("minute").fromNow() : "Never"}
                      </p>
                    </div>

                    <div>
                      <button
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700"
                        onClick={() => handleSync(account)}
                      >
                        Sync Now
                        <RefreshIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <button
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-md font-medium rounded text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={() => router.push(`/accounts/${accountId}`)}
                    >
                      View Institution
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }

    const holdingsArray = Object.entries(holdingsObjects).map((obj) => obj[1])

    return (
      <>
        <Toaster />
        <div className="bg-white px-4 py-5 border border-gray-200 mb-4 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {props.renderAssets ? "Account Assets" : "Accounts List"}
          </h3>
        </div>
        <div className="max-w-7xl mx-auto border border-gray-200 py-4 sm:px-6 lg:px-8 max-h-96 overflow-y-scroll">
          {renderMultiple(holdingsArray, props.renderAssets, holdings)}
        </div>

        {props.hasButton && (
          <button
            className="mt-10 inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-md font-medium rounded text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={() => router.push("/accounts/new")}
          >
            Link Account
          </button>
        )}
      </>
    )
  }

  return renderList(holdings)
}

export default BanksList
