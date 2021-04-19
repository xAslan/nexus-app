import { useCallback, useContext, createContext, useEffect, useState } from "react"
import _ from "lodash"
import { getAssetsAmounts, getFiatAmounts } from "app/accounts/utils/getAccountHoldingSums"
import {
  getAssetsAmounts as getAccountAssetsAmount,
  getFiatAmounts as getAccountFiats,
} from "app/accounts/utils/getAccountSums"

const holdingsContext = createContext()

const useGetAccountsSum = (accounts = []) => {
  return useCallback(async () => {
    if (Array.isArray(accounts)) {
      //- Used in main user dashboard
      const accountsSums = await _.map(accounts, getAssetsAmounts)
      const mergedHoldings = await getFiatAmounts(accountsSums)

      return mergedHoldings
    }
    //- Individual account dashboard
    const accountsSums = await getAccountAssetsAmount(accounts)
    const mergedHoldings = await getAccountFiats(accountsSums)

    return mergedHoldings
  }, [accounts])
}

export const AggregateProvider = (props) => {
  const [holdingsAr, setHoldings] = useState({})

  const callback = useGetAccountsSum(props.accounts)

  useEffect(() => {
    const runner = async function running(accounts) {
      const mergedHoldings = await callback()
      setHoldings(mergedHoldings)
    }

    runner(props.accounts)
  }, [props.accounts])

  return <holdingsContext.Provider value={holdingsAr}>{props.children}</holdingsContext.Provider>
}

export const useAggregates = () => useContext(holdingsContext)
