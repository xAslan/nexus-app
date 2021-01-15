import React from "react"
import { Link } from "blitz"
import login from "app/auth/mutations/login"
import { MdEmail, MdLock } from "react-icons/md"
import { Button, Row, Col, Form, Input, message, Checkbox } from "antd"
import * as styled from "app/components/styles"

type LoginFormProps = {
  onSuccess?: () => void
}

export const LoginForm = (props: LoginFormProps) => {
  const handleSubmit = async (values) => {
    try {
      await login({ email: values.email, password: values.password })
      props.onSuccess && props.onSuccess()
    } catch (error) {
      if (error.name === "AuthenticationError") {
        return message.error("Sorry, those credentials are invalid")
      } else {
        return message.error("Sorry, We have an unexpected Error!")
      }
    }
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
    <styled.FormWrapper>
      <header>
        <h2> Login </h2>
      </header>
      <Row type="flex" justify="center">
        <Col xs={23} lg={18}>
          <Form
            name="Login_Form"
            onFinish={handleSubmit}
            {...formItemLayout}
            labelAlign="left"
            onFinishFailed={(error) => {
              console.log(error)
              return message.error("Sorry, We have an unexpected Error!")
            }}
          >
            <SignInFields {...props} />

            <ActionButtons {...props} />
          </Form>
        </Col>
      </Row>
    </styled.FormWrapper>
  )
}

export default LoginForm

const SignInFields = (props) => {
  return (
    <>
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
        <Input size="large" prefix={<MdEmail />} />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input.Password size="large" prefix={<MdLock />} type="password" placeholder="Password" />
      </Form.Item>
    </>
  )
}

const ActionButtons = (props) => {
  const [rememberUser, setRememberUser] = React.useState(true)

  return (
    <Form.Item>
      <Checkbox onChange={() => setRememberUser(!rememberUser)}>Remember me</Checkbox>
      <Link href="forgot">
        <a>Forgot password</a>
      </Link>
      <Row justify="center">
        <Col xs={22} lg={18} xxl={16}>
          <Button type="primary" size="large" block htmlType="submit">
            <strong>Login</strong>
          </Button>
          <p>
            {" "}
            Not registered yet? &nbsp;
            <Link href="/signup">
              <a>Sign Up</a>
            </Link>
          </p>
        </Col>
      </Row>
    </Form.Item>
  )
}
