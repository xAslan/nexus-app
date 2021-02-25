import { Button, Row, Col, Form, Input, message, Radio } from "antd"
import { useState } from "react"
import { useRouter } from "blitz"
import { FormWrapper as StyledFormWrapper } from "app/components/styles"
import { AiOutlineGlobal } from "react-icons/ai"
import { accountTypes } from "app/accounts/components/accountTypes"
import Zabo from "zabo-sdk-js"

export const AccountTypesForm = (props) => {
  const [accountType, setAccounttype] = useState(null)
  const router = useRouter()

  const connectWithZabo = async () => {
    const zabo = await Zabo.init({
      clientId: process.env.NEXT_PUBLIC_ZABO_CLIENT_ID,
      env: "sandbox",
    })

    zabo.connect().onConnection((account) => {
      try {
        props.onSuccess && props.onSuccess({ account, type: "crypto" })
      } catch (err) {
        console.error(err)
      }
    })
  }

  const handleSubmitError = (error) => {
    console.log(error)
    return message.error("Sorry, We have an unexpected Error!")
  }

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
    },
    labelCol: {
      xs: { span: 24 },
    },
  }

  const handleCancel = () => {
    router.back()
  }

  const renderForm = (type) => {
    switch (type) {
      case accountTypes.TRADITIONAL_BANKS: {
        return (
          <Button block size="large" type="primary">
            <strong>Continue with Plaid</strong>
          </Button>
        )
      }
      case accountTypes.CRYPTO_EXCHANGE: {
        return (
          <Button onClick={connectWithZabo} block size="large" type="primary">
            <strong>Continue with Zabo</strong>
          </Button>
        )
      }
    }
  }

  return (
    <StyledFormWrapper headerFont="1.2em">
      <header>
        <h2>Select Account Type</h2>
      </header>
      <main>
        <Row type="flex" justify="center">
          <Col xs={24} lg={18}>
            <Form
              name="Account Type Form"
              {...formItemLayout}
              labelAlign="left"
              initialValues={{ type: "TRADITIONAL_BANKS" }}
              onFinishFailed={handleSubmitError}
            >
              <Form.Item
                name="type"
                rules={[
                  {
                    required: true,
                    message: "Please input your Account type",
                  },
                ]}
              >
                <Radio.Group onChange={(e) => setAccounttype(e.target.value)}>
                  <Row justify="center">
                    <Col xs={24}>
                      <Radio value={accountTypes.TRADITIONAL_BANKS}>
                        <strong>Traditional Finance</strong>
                      </Radio>
                    </Col>
                    <Col xs={24}>
                      <Radio value={accountTypes.CRYPTO_EXCHANGE}>
                        <strong>Crypto</strong>
                      </Radio>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
              {renderForm(accountType)}

              <Button htmlType="submit" type="link" block onClick={handleCancel}>
                <strong>Back</strong>
              </Button>
            </Form>
          </Col>
        </Row>
      </main>
    </StyledFormWrapper>
  )
}

export const AddBankAccount = () => {
  const handleSubmit = async (values) => {
    try {
      console.log(values)
      message.success("Plaid intergration coming soon ...")
    } catch (error) {
      return message.error("Sorry, We have an unexpected Error!")
    }
  }

  const handleSubmitError = (error) => {
    console.log(error)
    return message.error("Sorry, We have an unexpected Error!")
  }

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
    },
    labelCol: {
      xs: { span: 24 },
    },
  }

  return (
    <StyledFormWrapper headerFont="1.2em">
      <header>
        <h2>Add Bank Account</h2>
      </header>
      <Row type="flex" justify="center">
        <Col xs={24} lg={18} xl={16}>
          <Form
            name="Add Bank Account Form"
            onFinish={handleSubmit}
            {...formItemLayout}
            labelAlign="left"
            onFinishFailed={handleSubmitError}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Bank User name",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your Bank user name"
                prefix={<AiOutlineGlobal />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your bank password",
                },
              ]}
            >
              <Input.Password size="large" placeholder="Enter your Bank Password" />
            </Form.Item>

            <Row justify="center">
              <Col xs={24} lg={20}>
                <Row justify="space-between">
                  <Button type="default">
                    <strong>Back</strong>
                  </Button>
                  <Button htmlType="submit" type="primary">
                    <strong>Submit</strong>
                  </Button>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </StyledFormWrapper>
  )
}
