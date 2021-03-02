import styled from "styled-components"

export const AccountsPageWrapper = styled.main`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2.4em;

  main {
    min-width: calc(10vw + 20em);
  }
`

export const PanelHeader = styled.section`
  display: flex;
  justify-content: space-between;

  strong {
    color: #8e8e8e;
  }

  span {
    font-weight: 800;
  }
`

export const PanelBody = styled.section`
  ul {
    list-style: none;
  }

  li {
    border-bottom: 1px solid #f2f2f2;
    padding: 0.4em 0;
    margin: 0.8em 0;
  }
`
