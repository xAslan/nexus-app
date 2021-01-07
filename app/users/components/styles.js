import styled from "styled-components"
import { Card } from "antd"

export const TotalAmountCard = styled(Card)`
  p {
    display: flex;
    justify-content: space-between;
  }

  strong {
    font-size: 1.2em;
    width: 60%;
  }

  span {
    width: 30%;
  }

  background-color: #afe1ce;
  box-shadow: 1px 4px 5px 0px rgba(50, 50, 50, 0.3);
  margin-bottom: 1em;
`

export const AccountsCard = styled(Card)`
  .ant-card-head {
    background-color: #154a39;
    color: #fff;
  }

  .ant-card-body {
    padding: 1em 0.24em;
  }
`

export const BanksList = styled.section`
  transition: background-color 0.64s ease;
  padding: 0 0.64em;
  width: 100%;

  &:hover {
    background-color: #9be15d;
  }

  div {
    display: flex;
    justify-content: space-between;
  }
`

export const CenteredButton = styled.section`
  width: 80%;
  margin: 0 auto;

  button {
    background-color: #52c41a;
    color: #fff;
    font-weight: 800;
  }
`

export const CashFlowCard = styled(Card)`
  max-height: 24em;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  header {
    display: flex;
    justify-content: space-between;
  }

  li {
    margin-bottom: 1em;

    &:last-child {
      margin-bottom: 0;
    }

    p {
      margin: 0;
      display: flex;
      justify-content: space-between;
    }
  }
`

export const RecentActivitiesCard = styled(CashFlowCard)`
  overflow-y: scroll;

  li {
    display: flex;
    justify-content: space-between;
  }

  main {
    display: flex;
    justify-content: space-between;

    p {
      padding-left: 0.64em;
      display: flex;
      flex-direction: column;
    }
  }
`
