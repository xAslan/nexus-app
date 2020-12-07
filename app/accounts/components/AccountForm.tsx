import React, { Suspense, useState } from "react"
import { useQuery } from "blitz"
import getInstitution from "app/institutions/queries/getInstitution"
import getInstitutions from "app/institutions/queries/getInstitutions"
import { Account } from "@prisma/client"

type AccountFormProps = {
  account: Account | null
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

const AccountForm = ({ account, onSubmit }: AccountFormProps) => {
  //const [initialInstitution, { setQueryData }] = useQuery(getInstitution, { where: { id: 1 } })
  const [institution, setInstitution] = useState(null)
  let initialInstitution = (//if(account?.institutionId) {
  null[initialInstitution] = useQuery(getInstitution, { where: { id: account.institutionId } }))
  //}
  //const initialInstitution = useQuery(getInstution, { })

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
      {institution?.authType == "api" && <ApiForm account={account}></ApiForm>}
      <button>Submit</button>
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
