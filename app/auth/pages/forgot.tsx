import React from "react"
import { useRouter, BlitzPage } from "blitz"
import Layout from "app/layouts/Layout"
import { RecoveryEmailForm } from "app/auth/components/passwordRecovery"

const RecoveryEmailPage: BlitzPage = () => {
  const router = useRouter()
  const handleRecovery = ({ email }) =>
    router.push({
      pathname: "/reset",
      query: { email },
    })

  return (
    <div>
      <RecoveryEmailForm onSuccess={handleRecovery} />
    </div>
  )
}

RecoveryEmailPage.getLayout = (page) => <Layout title="Reset Password">{page}</Layout>

export default RecoveryEmailPage
