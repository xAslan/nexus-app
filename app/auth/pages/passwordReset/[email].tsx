import React from "react"
import { useParam, useRouter, BlitzPage } from "blitz"
import Layout from "app/layouts/Layout"
import { ResetPasswordForm } from "app/auth/components/passwordRecovery"
import { resetPassword } from "app/auth/auth-utils"
import toast, { Toaster } from "react-hot-toast"

const ResetPasswordPage: BlitzPage = () => {
  const router = useRouter()
  const userEmail = useParam("email", "string")

  const handlePasswordReset = async ({ password }) => {
    try {
      await resetPassword({ email: userEmail, password })
      toast.success("Password reset complete!")
    } catch (err) {
      toast.error("Something went wrong, please try again.")
      console.error(err)
    }
  }

  return (
    <>
      <Toaster />
      <ResetPasswordForm onSuccess={({ newPassword }) => handlePasswordReset(newPassword)} />
    </>
  )
}

ResetPasswordPage.getLayout = (page) => <Layout title="Reset Password">{page}</Layout>

export default ResetPasswordPage
