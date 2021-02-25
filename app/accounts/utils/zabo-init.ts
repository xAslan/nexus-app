import Zabo from "zabo-sdk-js"

export default async function zaboInit() {
  const zabo = await Zabo.init({
    apiKey: process.env.ZABO_API_KEY,
    secretKey: process.env.ZABO_SECRET,
    env: "sandbox",
  })

  return zabo
}

export const zaboClientInit = async () => {
  return await Zabo.init({
    clientId: process.env.NEXT_PUBLIC_ZABO_CLIENT_ID,
    env: "sandbox",
  })
}
