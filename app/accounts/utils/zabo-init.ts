import Zabo from "zabo-sdk-js"

export default async function zaboInit() {
  const zaboOptions = {
    apiKey:
      process.env.APP_ENV === "production"
        ? process.env.ZABO_PROD_API_KEY
        : process.env.ZABO_DEV_API_KEY,
    secretKey:
      process.env.APP_ENV === "production"
        ? process.env.ZABO_PROD_SECRET
        : process.env.ZABO_DEV_SECRET,
    env: process.env.NODE_ENV === "production" ? "live" : "sandbox",
  }

  const zabo = await Zabo.init(zaboOptions)

  return zabo
}

export const zaboClientInit = async () => {
  const zaboOptions = {
    clientId:
      process.env.NEXT_PUBLIC_APP_ENV === "production"
        ? process.env.NEXT_PUBLIC_ZABO_CLIENT_ID
        : process.env.NEXT_PUBLIC_ZABO_DEV_CLIENT_ID,
    env: process.env.NEXT_PUBLIC_APP_ENV === "production" ? "live" : "sandbox",
  }

  return await Zabo.init(zaboOptions)
}
