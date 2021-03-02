import { useRouter, useQuery } from "blitz"
import { Collapse, Row, Col, Button } from "antd"
import { AiFillCaretRight } from "react-icons/ai"
import { FormWrapper as StyledFormWrapper } from "app/components/styles"
import getHoldingsAgg from "app/queries/holdingsAggregate"
import * as styled from "app/accounts/components/styles"

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

        <p>Fiat Amount USD {holding.fiatAmount}</p>
      </li>
    ))
  }

  const renderPanels = (accounts) => {
    return accounts.map((account, idx) => {
      //- Using a hook inside a .map function is a bad practise.
      //const {sum} = useQuery(getHoldingsAgg, {subAccountId: account.subAccounts[0].id})[0]
      return (
        <Panel
          key={idx}
          header={
            <styled.PanelHeader>
              <strong>{account.name}</strong>
              {/*<span> $ {sum.fiatAmount} </span>*/}
            </styled.PanelHeader>
          }
        >
          <Row justify="start">
            <Col xs={24}>
              <styled.PanelBody>
                <ul>{renderHoldings(account.subAccounts)}</ul>
              </styled.PanelBody>
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
