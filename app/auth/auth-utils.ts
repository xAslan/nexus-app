import { AuthenticationError } from "blitz"
import SecurePassword from "secure-password"
import db from "db"

const SP = new SecurePassword()

export const hashPassword = async (password: string) => {
  const hashedBuffer = await SP.hash(Buffer.from(password))
  return hashedBuffer.toString("base64")
}
export const verifyPassword = async (hashedPassword: string, password: string) => {
  try {
    return await SP.verify(Buffer.from(password), Buffer.from(hashedPassword, "base64"))
  } catch (error) {
    console.error(error)
    return false
  }
}

export const authenticateUser = async (email: string, password: string) => {
  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } })

  if (!user || !user.hashedPassword) throw new AuthenticationError()

  switch (await verifyPassword(user.hashedPassword, password)) {
    case SecurePassword.VALID:
      break
    case SecurePassword.VALID_NEEDS_REHASH:
      // Upgrade hashed password with a more secure hash
      const improvedHash = await hashPassword(password)
      await db.user.update({ where: { id: user.id }, data: { hashedPassword: improvedHash } })
      break
    default:
      throw new AuthenticationError()
  }

  const { hashedPassword, ...rest } = user
  return rest
}

//TODO: This should only run after email verification
export const resetPassword = async ({ email, password }) => {
  const user = await db.user.findUnique({ where: { email } })

  const hashedPassword = await hashPassword(password)
  await db.user.update({ where: { id: user.id }, data: { hashedPassword } })

  delete user.hashedPassword
  return user as Omit<User, "hashedPassword">
}

export const updatePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await db.user.findUnique({ where: { id: userId } })

  switch (await verifyPassword(user.hashedPassword, currentPassword)) {
    case SecurePassword.VALID:
      const newHashedPassword = await hashPassword(newPassword)
      await db.user.update({ where: { id: user.id }, data: { hashedPassword: newHashedPassword } })
      break
    case SecurePassword.VALID_NEEDS_REHASH:
      // Upgrade hashed password with a newly created hashed password
      const newPasswordHash = await hashPassword(newPassword)
      await db.user.update({ where: { id: user.id }, data: { hashedPassword: newPasswordHash } })
      break
    default:
      throw new Error("Could not change password, Try again.")
  }

  delete user.hashedPassword
  return user as Omit<User, "hashedPassword">
}
