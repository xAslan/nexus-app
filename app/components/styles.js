import styled from "styled-components"

export const FormWrapper = styled.section`
  max-width: 480px;
  margin: auto;
  margin-top: 2em;
  box-shadow: 0px 3px 5px 0px rgba(50, 50, 50, 0.25);

  main {
    padding: 0.64em 2.4em;
  }

  label {
    margin: 0.64em 0;
  }

  header {
    background-color: #154a39;

    h2 {
      margin-left: 1em;
      font-size: ${(props) => props.headerFont || "1.4em"};
      line-height: 2.4em;
      font-weight: bold;
      color: #fff;
    }
  }

  button {
    margin: 1.2em 0;
  }
`
