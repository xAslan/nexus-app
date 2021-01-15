import React from "react"
import { useParam, useRouter, BlitzPage } from "blitz"
import Layout from "app/layouts/Layout"
import { ResetPasswordForm } from "app/auth/components/resetPassword"
import { resetPassword } from "app/auth/auth-utils"

const ResetPasswordPage: BlitzPage = () => {
  const router = useRouter()
  const userEmail = useParam("email", "string")

  const handlePasswordReset = async ({ password }) => {
    try {
      await resetPassword({ email: userEmail, password })
      message.success("Password reset complete!")
    } catch (err) {
      message.error("Something went wrong, please try again.")
      console.error(err)
    }
  }

  return <ResetPasswordForm onSuccess={({ newPassword }) => handlePasswordReset(newPassword)} />
}

ResetPasswordPage.getLayout = (page) => <Layout title="Reset Password">{page}</Layout>

export default ResetPasswordPage
