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
    clientId: "Wj0YWr73LWUB9XTgQaC5N1r4VNoA9KZIy7V7HTFEs6L4iLFP3EUIzrHxXdbKydyM",
    env: "sandbox",
  })
}
