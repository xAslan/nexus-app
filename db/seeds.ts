import db from "./index"
import { hashPassword } from "app/auth/auth-utils"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */
const seed = async () => {
  // for (let i = 0; i < 5; i++) {
  //   await db.project.create({ data: { name: "Project " + i } })
  // }
  let defaultPass = await hashPassword("123456")
  const admin = await db.user.create({
    data: { name: "Admin", email: "admin@test.com", hashedPassword: defaultPass, role: "admin" },
  })
  await db.user.create({
    data: { name: "User", email: "user@test.com", hashedPassword: defaultPass },
  })
  await db.institution.create({ data: { name: "Binance", shortName: "binance", authType: "api" } })
  await db.institution.create({ data: { name: "Chase", shortName: "chase" } })
  await db.institution.create({ data: { name: "eToro", shortName: "etoro" } })
  /*await db.account.create({data: {
    name: 'Test Binance Account1', 
    user: admin,
    apiKey: process.env.BINANCE_API_KEY
    apiSecret : process.env.BINANCE_API_SECRET
  }})*/
}

export default seed
