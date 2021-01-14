import React from "react"
import { Link } from "blitz"
import login from "app/auth/mutations/login"
import { MdEmail, MdLock } from "react-icons/md"
import { Button, Row, Col, Form, Input, message, Checkbox } from "antd"
import * as styled from "app/components/styles"

type PasswordResetProps = {
  onSuccess?: () => void
}

const formItemLayout = {
  wrapperCol: {
    xs: { span: 24 },
  },
  labelCol: {
    xs: { span: 24 },
  },
}

export const RecoveryEmailForm = (props: PasswordResetProps) => {
  const handleSubmit = async (values) => {
    try {
      props.onSuccess && props.onSuccess(values)
    } catch (error) {
      return message.error("Sorry, We have an unexpected Error!")
    }
  }

  const handleFailedSubmit = (error) => {
    console.log(error)
    return message.error("Sorry, We have an unexpected Error!")
  }

  return (
    <styled.FormWrapper>
      <header>
        <h2>Forgot Password</h2>
      </header>
      <Row type="flex" justify="center">
        <Col xs={23} lg={18}>
          <Form
            name="Recovery_Email_Form"
            onFinish={handleSubmit}
            {...formItemLayout}
            labelAlign="left"
            onFinishFailed={handleFailedSubmit}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input size="large" placeholder="Recovery Email" prefix={<MdEmail />} />
            </Form.Item>
            <Form.Item>
              <Row justify="center">
                <Col xs={22} lg={18} xxl={16}>
                  <Button type="primary" size="large" block htmlType="submit">
                    <strong>Send Recovery Email</strong>
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </styled.FormWrapper>
  )
}

export const ResetPasswordForm = (props: PasswordResetProps) => {
  const handleSubmit = async (values) => {
    try {
      if (typeof values?.password !== "undefined") {
        props.onSuccess && props.onSuccess(values)
      }
    } catch (error) {
      return message.error("Sorry, We have an unexpected Error!")
    }
  }

  const handleFailedSubmit = (error) => {
    console.log(error)
    return message.error("Sorry, We have an unexpected Error!")
  }

  return (
    <styled.FormWrapper>
      <header>
        <h2>Reset Password</h2>
      </header>
      <Row type="flex" justify="center">
        <Col xs={23} lg={18}>
          <Form
            name="Recovery_Email_Form"
            onFinish={handleSubmit}
            {...formItemLayout}
            labelAlign="left"
            onFinishFailed={handleFailedSubmit}
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                {
                  required: true,
                  message: "Enter new Password",
                },
              ]}
            >
              <Input.Password size="large" placeholder="New Password" />
            </Form.Item>
            <Form.Item>
              <Row justify="center">
                <Col xs={22} lg={18} xxl={16}>
                  <Button type="primary" size="large" block htmlType="submit">
                    <strong>Reset Password</strong>
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </styled.FormWrapper>
  )
}
