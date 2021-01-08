import { Card, Row, Col, Typography, Divider, Button } from "antd"
import "antd/dist/antd.css"

const { Title } = Typography

export const currencyCard = () => {
  return (
    <div className="site-statistic-demo-card">
      <Card style={{ width: 300, backgroundColor: "#AFE1CE" }}>
        <Row gutter={[8, 8]}>
          <Col span={15}>
            <Title level={4}>$10,000</Title>
          </Col>
          <Col span={9}>
            <Title level={4}>+4%</Title>
          </Col>

          <Col span={15}>
            <Title level={4}>$8000</Title>
          </Col>
          <Col span={9}>
            <Title level={4}>30 days</Title>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
