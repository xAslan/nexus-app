import { useRouter } from "blitz"
import { Collapse, Row, Col, Button } from "antd"
import { AiFillCaretRight, AiOutlineCaretDown } from "react-icons/ai"
import { FormWrapper as StyledFormWrapper } from "app/components/styles"

const { Panel } = Collapse

const AccountsView = (props) => {
  const router = useRouter()

  const handleAccountVisit = (id) => router.push(`/accounts/${id}`)

  const renderHoldings = (subAccounts) => {
    return subAccounts[0].holdings.map((holding, idx) => (
      <li key={idx}>
        <p>
          Amount {holding.asset.symbol} {holding.amount}
        </p>
      </li>
    ))
  }

  const renderPanels = (accounts) => {
    return accounts.map((account, idx) => {
      return (
        <Panel key={idx} header={account.name}>
          <Row justify="start">
            <Col xs={24}>
              <ul>{renderHoldings(account.subAccounts)}</ul>
            </Col>
          </Row>

          <Row justify="end">
            <Button type="primary" onClick={() => handleAccountVisit(account.id)}>
              {" "}
              Visit Account{" "}
            </Button>
          </Row>
        </Panel>
      )
    })
  }

  return (
    <StyledFormWrapper>
      <header>
        <h2>Accounts List</h2>
      </header>
      <main>
        <Collapse
          bordered={false}
          defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => <AiFillCaretRight />}
          accordion
        >
          {renderPanels(props.accounts)}
        </Collapse>
      </main>
    </StyledFormWrapper>
  )
}

export default AccountsView
