import { Ctx } from "blitz"
import { resetPassword } from "app/auth/auth-utils"
import { ResetPasswordInput, ResetPasswordInputType } from "../validations"

export default async function passwordReset(input: ResetPasswordInputType, { session }: Ctx) {
  // This throws an error if input is invalid
  const { email, password } = ResetPasswordInput.parse(input)

  // This throws an error if credentials are invalid
  const user = await resetPassword(input)

  await session.create({ userId: user.id, roles: [user.role] })

  return user
}
