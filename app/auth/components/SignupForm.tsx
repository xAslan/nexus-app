import { useMutation, useRouter, Link } from "blitz"
import signup from "app/auth/mutations/signup"
import { Button, message, Form, Input, Row, Col, Checkbox } from "antd"
import { MdEmail, MdPerson } from "react-icons/md"
import * as styled from "app/components/styles"

const SignupForm = (props) => {
  const router = useRouter()
  const [signupMutation] = useMutation(signup)

  const formItemLayout = {
    wrapperCol: {
      xs: { span: 24 },
    },
    labelCol: {
      xs: { span: 24 },
    },
  }

  const handleSubmit = async (values) => {
    try {
      delete values.agreement
      await signupMutation({ email: values.email, name: values.name, password: values.password })
      router.back()

      message.success("User created!")
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        // This error comes from Prisma
        message.error("Email is already being used.")
      } else {
        console.log(error.toString())
        message.error(`Something is wrong ${error.toString()}`)
      }
    }
  }

  return (
    <styled.FormWrapper>
      <header>
        <h2> Sign Up </h2>
      </header>
      <main>
        <Row justify="center">
          <Col xs={24}>
            <Form {...formItemLayout} onFinish={handleSubmit} labelAlign="left">
              <RegistrationFields {...props.form} />
              <ActionButons {...props} />
            </Form>
          </Col>
        </Row>
      </main>
    </styled.FormWrapper>
  )
}

const ActionButons = (props) => {
  return (
    <Form.Item>
      <Row justify="center">
        <Col xs={22}>
          <Button block type="primary" size="large" htmlType="submit">
            <strong>Register</strong>
          </Button>
          <p>
            {" "}
            Already a member? &nbsp;
            <Link href="login">
              <a> Sign in </a>
            </Link>
          </p>
        </Col>
      </Row>
    </Form.Item>
  )
}

const RegistrationFields = (props) => {
  return (
    <>
      <Form.Item
        label="Name"
        rules={[{ required: true, message: "Please input your name!" }]}
        name="name"
      >
        <Input size="large" suffix={<MdPerson />} />
      </Form.Item>
      <Form.Item
        label="E-mail"
        name="email"
        rules={[
          {
            type: "email",
            message: "Not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input size="large" suffix={<MdEmail />} />
      </Form.Item>
      <Form.Item
        label="Password"
        hasFeedback
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password size="large" id="password" />
      </Form.Item>
      <Form.Item name="agreement">
        <Checkbox>
          I have read the <a href="/terms">agreement</a>
        </Checkbox>
        ,
      </Form.Item>
    </>
  )
}

export default SignupForm
