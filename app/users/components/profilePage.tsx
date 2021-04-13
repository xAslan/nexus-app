import React, { useState } from "react"
import { Card, Typography, Button, Select, Row, Col, Image, Input, Form } from "antd"
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  DollarTwoTone,
  EuroCircleTwoTone,
  PoundCircleTwoTone,
} from "@ant-design/icons"
import "antd/dist/antd.css"

const { Title } = Typography
const { TextArea } = Input

const { Option } = Select

function handleChange(value) {
  console.log(`selected ${value}`)
}

const ProfilePage = () => {
  const [form] = Form.useForm()
  const [requiredMark, setRequiredMarkType] = useState()

  const onRequiredTypeChange = ({ requiredMark }) => {
    setRequiredMarkType(requiredMark)
  }

  return (
    <Card style={{ width: 1000 }}>
      <Row>
        <Col span={10} style={{ textAlign: "center" }}>
          <Image
            width={200}
            src="https://www.nexusfinance.app/wp-content/uploads/2020/09/alan-mayer.jpg"
          />
          <Title level={3}>Alan Mayer</Title>
          <Title level={5}>CEO of Nexus Finance</Title>
        </Col>
        <Col span={14}>
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              requiredMark,
            }}
            onValuesChange={onRequiredTypeChange}
            requiredMark={requiredMark}
          >
            <Form.Item label="How many account used" bordered>
              <Input placeholder="5 types" />
            </Form.Item>
            <Form.Item label="Email">
              <Input placeholder="johndoe@gmail.com" />
            </Form.Item>
            <Form.Item label="Phone">
              <Input placeholder="041846841" />
            </Form.Item>
            <Form.Item label="Address">
              <TextArea rows={2} />
            </Form.Item>
            <Form.Item label="Password">
              <Input.Password placeholder="input password" />
            </Form.Item>
            <Form.Item label="Confirm Password">
              <Input.Password
                placeholder="input password"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>
            <Form.Item label="Settings primary currency">
              <Select defaultValue="USD" onChange={handleChange}>
                <Option value="USD">
                  <DollarTwoTone twoToneColor="#52c41a" /> USD
                </Option>
                <Option value="EUR">
                  <EuroCircleTwoTone twoToneColor="#52c41a" /> EUR
                </Option>
                <Option value="Pound">
                  <PoundCircleTwoTone twoToneColor="#52c41a" /> Pound
                </Option>
              </Select>
            </Form.Item>
            <Form.Item label="Settings secondary currency">
              <Select defaultValue="" onChange={handleChange}>
                <Option value="USD">
                  <DollarTwoTone twoToneColor="#52c41a" /> USD
                </Option>
                <Option value="EUR">
                  <EuroCircleTwoTone twoToneColor="#52c41a" /> EUR
                </Option>
                <Option value="Pound">
                  <PoundCircleTwoTone twoToneColor="#52c41a" /> Pound
                </Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" style={{ backgroundColor: "#29945F", borderColor: "#29945F" }}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  )
}

export default ProfilePage
