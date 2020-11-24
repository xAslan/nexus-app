import React, { Suspense, useState } from "react"
import { useQuery } from "blitz"
import getInstitutions from "app/institutions/queries/getInstitutions"
import { isNamedTupleMember } from "typescript"
import { Form, Field } from "react-final-form"
import { setIn } from "final-form"

type AccountFormProps = {
  initialValues: any
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

const AccountForm = ({ initialValues, onSubmit }: AccountFormProps) => {
  const [institution, setInstitution] = useState(initialValues.institution)
  const [authForm, setAuthForm] = useState(null)
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(event)
      }}
    >
      <Suspense fallback="Loading...">
        <InstitutionSelect {...{ institution, setInstitution, setAuthForm }} />
      </Suspense>
      <br />
      Account Nickname (optional):
      <input placeholder="My Special Account..." />
      <br></br>
      {institution?.authType == "api" && <ApiForm></ApiForm>}
      <button>Submit</button>
    </form>
  )
}

const InstitutionSelect = ({ institution, setInstitution, setAuthForm }) => {
  const [{ institutions }] = useQuery(getInstitutions, {})
  return (
    <select
      required
      id="institution"
      value={institution?.id}
      onBlur={(e) => {
        setInstitution(institutions.find((i) => i.id == parseInt(e.target.value)))
        console.log(e.target.value)
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

const ApiForm = () => {
  return (
    <>
      API Key
      <input id="apiKey" placeholder="abc123..." />
      <br />
      API Secret
      <input id="apiSecret" placeholder="123abc..." />
      <br />
    </>
  )
}

export default AccountForm
