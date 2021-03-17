import db from "./index"
import SecurePassword from "secure-password"
import { hashPassword } from "app/auth/auth-utils"

const seed = async () => {
  try {
    const defaultPass = await hashPassword("123456")
    const admin = await db.user.create({
      data: { name: "Admin", email: "admin@test.com", hashedPassword: defaultPass, role: "admin" },
    })
    await db.user.create({
      data: { name: "User", email: "user@test.com", hashedPassword: defaultPass },
    })

    /*
      await db.asset.create({ data: { name: "bitcoin", symbol: "BTC" } })
      await db.asset.create({ data: { name: "ethereum", symbol: "ETH" } })
      await db.institution.create({
        data: { name: "Binance", shortName: "binance", authType: "api" },
      })
      await db.institution.create({ data: { name: "Chase", shortName: "chase" } })
      await db.institution.create({ data: { name: "eToro", shortName: "etoro" } })
    */
  } catch (err) {
    console.log(err)
  }
}

export default seed
