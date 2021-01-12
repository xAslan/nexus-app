import React, { useCallback } from "react"
import { usePlaidLink } from "react-plaid-link"
import { useQuery } from "blitz"
import getPlaidLinkToken from "../queries/getPlaidLinkToken"

const Link = () => {
  const linkToken = useQuery(getPlaidLinkToken, {})
  const onSuccess = useCallback((token, metadata) => {
    // send token to server
    // create mutation that exchanges the linkToken for an access token and stores the access token in the user's account data
  }, [])

  const config = {
    token: linkToken,
    onSuccess,
    // ...
  }

  const { open, ready, error } = usePlaidLink(config)

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  )
}
export default Link
