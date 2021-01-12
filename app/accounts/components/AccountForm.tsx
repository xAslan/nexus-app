import React, { Suspense, useEffect, useState } from "react"
import { useQuery } from "blitz"
import getInstitution from "app/institutions/queries/getInstitution"
import getInstitutions from "app/institutions/queries/getInstitutions"
import { Account, Institution } from "@prisma/client"
import Link from "./Link"

type AccountFormProps = {
  account: Account | null
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

const AccountForm = ({ account, onSubmit }: AccountFormProps) => {
  const [institution, setInstitution] = useState<Institution | null>(null)
  const [initialInstitution] = useQuery(
    getInstitution,
    { where: { id: account?.institutionId! } },
    { enabled: !!account?.institutionId }
  )
  useEffect(() => {
    setInstitution(initialInstitution)
  }, [initialInstitution])

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(event)
      }}
    >
      <Suspense fallback="Loading...">
        <InstitutionSelect {...{ institution, setInstitution }} />
      </Suspense>
      <br />
      Account Nickname (optional):
      <input placeholder="My Special Account..." defaultValue={account?.name} />
      <br></br>
      {institution?.authType === "api" && <ApiForm account={account}></ApiForm>}
      {institution?.authType === "plaid" && <Link />}
    </form>
  )
}

const InstitutionSelect = ({ institution, setInstitution }) => {
  const [{ institutions }] = useQuery(getInstitutions, {})
  return (
    <select
      required
      id="institution"
      value={institution?.id}
      onChange={(e) => {
        setInstitution(institutions.find((i) => i.id == parseInt(e.target.value)))
      }}
      onBlur={(e) => {
        setInstitution(institutions.find((i) => i.id == parseInt(e.target.value)))
      }}
    >
      <option>Select an Institution</option>
      {institutions.map((institution) => (
        <option key={institution.id} value={institution.id}>
          {institution.name}
        </option>
      ))}
    </select>
  )
}

const ApiForm = ({ account }) => {
  console.log(account?.account)
  return (
    <>
      API Key
      <input id="apiKey" placeholder="abc123..." defaultValue={account?.apiKey} />
      <br />
      API Secret
      <input id="apiSecret" placeholder="123abc..." defaultValue={account?.apiSecret} />
      <br />
    </>
  )
}

export default AccountForm
