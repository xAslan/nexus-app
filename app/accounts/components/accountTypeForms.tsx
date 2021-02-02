import { Form, Input } from "antd"
import { AiOutlineGlobal } from "react-icons/ai"

export const CryptoWalletForm = () => {
  return (
    <>
      <Form.Item
        name="coin"
        rules={[
          {
            required: true,
            message: "Please input your Bank name or URL",
          },
        ]}
      >
        <Input size="large" placeholder="Coin" prefix={<AiOutlineGlobal />} />
      </Form.Item>
      <Form.Item
        name="walletAddress"
        rules={[
          {
            required: true,
            message: "Please input your Bank name or URL",
          },
        ]}
      >
        <Input size="large" placeholder="Wallet Address" prefix={<AiOutlineGlobal />} />
      </Form.Item>
    </>
  )
}

export const CryptoExchangeForm = () => {
  return (
    <>
      <Form.Item
        name="apiKey"
        rules={[
          {
            required: true,
            message: "Please input your API Key",
          },
        ]}
      >
        <Input size="large" placeholder="API KEY" prefix={<AiOutlineGlobal />} />
      </Form.Item>
      <Form.Item
        name="apiSecret"
        rules={[
          {
            required: true,
            message: "Please input your API SECRET",
          },
        ]}
      >
        <Input size="large" placeholder="API SECRET" prefix={<AiOutlineGlobal />} />
      </Form.Item>
    </>
  )
}
