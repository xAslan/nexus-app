import React from "react"
import { useMutation, useRouter, useRouterQuery, BlitzPage } from "blitz"
import Layout from "app/layouts/Layout"
import { ResetPasswordForm } from "app/auth/components/passwordRecovery"
import resetPassword from "app/auth/mutations/resetPassword"
import { message } from "antd"

const ResetPasswordPage: BlitzPage = () => {
  const router = useRouter()
  const { email } = useRouterQuery()
  const [resetPasswordMutation] = useMutation(resetPassword)

  const handlePasswordReset = async ({ password }) => {
    try {
      await resetPasswordMutation({ email, password })
      message.success("Password reset complete!")
    } catch (err) {
      message.error("Something went wrong, please try again.")
      console.error(err)
    }
  }

  return <ResetPasswordForm onSuccess={handlePasswordReset} />
}

ResetPasswordPage.getLayout = (page) => <Layout title="Reset Password">{page}</Layout>

export default ResetPasswordPage
