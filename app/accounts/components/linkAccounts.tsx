import { Button, Row, Col, Form, Input, message, Radio } from "antd"
import { useCallback, useState } from "react"
import { useRouter, useMutation, useQuery } from "blitz"
import { usePlaidLink } from "react-plaid-link"
import { FormWrapper as StyledFormWrapper } from "app/components/styles"
import { AiOutlineGlobal } from "react-icons/ai"
import { accountTypes } from "app/accounts/utils/accountTypes"
import getPlaidLinkToken from "app/queries/getPlaidLinkToken"
import setAccessToken from "app/accounts/mutations/setAccessToken"
import Zabo from "zabo-sdk-js"
import { zaboClientInit } from "app/accounts/utils/zabo-init"

export const AccountTypesForm = (props) => {
  const [accountType, setAccounttype] = useState(null)
  const router = useRouter()
  const [plaidToken] = useQuery(getPlaidLinkToken, {})
  const [setAccessTokenMutation] = useMutation(setAccessToken)
  const [loading, setLoading] = useState(false)

  const onPlaidSuccess = useCallback(async (token, metadata) => {
    const plaidAccessToken = await setAccessTokenMutation({ token })

    try {
      ;(await props.onSuccess) &&
        props.onSuccess({
          type: accountTypes.TRADITIONAL_BANKS,
          plaidAccessToken,
        })
    } catch (err) {
      console.log(err)
    }
  })

  const plaidConfig = {
    token: plaidToken,
    onSuccess: onPlaidSuccess,
  }

  const { open, ready, error } = usePlaidLink(plaidConfig)

  const connectWithZabo = async () => {
    setLoading(true)
    const zabo = await zaboClientInit()

    zabo.connect().onConnection((account) => {
      try {
        if (account.balances.length > 0) {
          account.blockchain != null
            ? props.onSuccess && props.onSuccess({ account, type: accountTypes.BLOCKCHAIN_WALLET })
            : props.onSuccess && props.onSuccess({ account, type: accountTypes.CRYPTO_EXCHANGE })
        } else {
          message.info("Mh, There's 0 balance in this wallet, try another one.")
        }
      } catch (err) {
        console.error(err)
        message.error("Something went wrong please try again later")
      }
    })

    setLoading(false)
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
          <Button
            onClick={() => {
              setLoading(true)
              open()
              setLoading(false)
            }}
            disabled={!ready && loading}
            block
            size="large"
            type="primary"
          >
            <strong>{loading ? "Loading Plaid..." : "Continue with Plaid"}</strong>
          </Button>
        )
      }
      case accountTypes.CRYPTO_EXCHANGE: {
        return (
          <Button disabled={loading} onClick={connectWithZabo} block size="large" type="primary">
            <strong>{loading ? "Loading Zabo..." : "Continue with Zabo"}</strong>
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
