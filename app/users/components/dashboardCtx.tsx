import { useCallback, useContext, createContext, useEffect, useState } from "react"
import _ from "lodash"
import { getAssetsAmounts, getFiatAmounts } from "app/accounts/utils/getAccountHoldingSums"

const holdingsContext = createContext()

const useGetAccountsSum = (accounts = []) => {
  return useCallback(async () => {
    const accountsSums = await _.map(accounts, getAssetsAmounts)
    const mergedHoldings = await getFiatAmounts(accountsSums)

    return mergedHoldings
  }, [accounts])
}

export const AggregateProvider = (props) => {
  const [holdingsAr, setHoldings] = useState({})

  const callback = useGetAccountsSum(props.accounts)

  useEffect(() => {
    //- Run this function for one account
    //
    //- Repert for all accounts

    const runner = async function running(accounts) {
      const mergedHoldings = await callback()
      setHoldings(mergedHoldings)
    }

    runner(props.accounts)
  }, [props.accounts])

  return <holdingsContext.Provider value={holdingsAr}>{props.children}</holdingsContext.Provider>
}

export const useAggregates = () => useContext(holdingsContext)
