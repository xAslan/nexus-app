import { Card, Row, Col, Typography, Divider, Button } from "antd"
import "antd/dist/antd.css"
import { PlusOutlined } from "@ant-design/icons"

const { Title } = Typography

export const LinkAccount = () => {
  return (
    <Card
      title="Accounts"
      style={{ width: 300 }}
      headStyle={{ backgroundColor: "#154A39", color: "white" }}
    >
      <Row gutter={[8, 8]}>
        <Col span={16}>
          <Title level={5}>Ally Bank</Title>
          <small>Interest earnings in 2020</small>
        </Col>
        <Col span={8}>
          <Title level={5}>$5000</Title>
          <small>$5000</small>
        </Col>
        <Divider orientation="right"></Divider>
        <Col span={16}>
          <Title level={5}>Chase Bank</Title>
          <small>Interest earnings in 2020</small>
        </Col>
        <Col span={8}>
          <Title level={5}>$0</Title>
          <small>$0</small>
        </Col>
        <Divider orientation="right"></Divider>
        <Col span={16}>
          <Title level={5}>Binance Bank</Title>
          <small>Interest earnings in 2020</small>
        </Col>
        <Col span={8}>
          <Title level={5}>$2564</Title>
          <small>$2564</small>
        </Col>
        <Divider orientation="right"></Divider>
      </Row>

      <Row>
        <Col span={4}></Col>
        <Col span={16}>
          <Button
            type="primary"
            style={{ backgroundColor: "#154A39", borderColor: "#154A39" }}
            size="large"
          >
            <PlusOutlined /> Link Account
          </Button>
        </Col>
        <Col span={4}></Col>
      </Row>
    </Card>
  )
}
