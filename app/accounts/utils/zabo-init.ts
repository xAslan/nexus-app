import Zabo from "zabo-sdk-js"

export default async function zaboInit() {
  const zabo = await Zabo.init({
    apiKey:
      process.env.APP_ENV === "production"
        ? process.env.ZABO_PROD_API_KEY
        : process.env.ZABO_DEV_API_KEY,
    secretKey:
      process.env.APP_ENV === "production"
        ? process.env.ZABO_PROD_SECRET
        : process.env.ZABO_DEV_SECRET,
    env: process.env.NODE_ENV === "production" ? "live" : "sandbox",
  })

  return zabo
}

export const zaboClientInit = async () => {
  return await Zabo.init({
    clientId:
      process.env.APP_ENV === "production"
        ? process.env.NEXT_PUBLIC_ZABO_PROD_CLIENT_ID
        : process.env.NEXT_PUBLIC_ZABO_DEV_CLIENT_ID,
    env: process.env.APP_ENV === "production" ? "live" : "sandbox",
  })
}
