import styled from "styled-components"

export const HeaderNav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  background-color: #154a39;
  height: 4em;

  > div {
    max-width: 1080px;

    img {
      width: 100%;
    }
  }

  button {
    padding: 0;
    margin: 0;
    line-height: 1em;
    background-color: transparent;
    border: none;
    color: #ffe;
  }

  a,
  button {
    color: #eee;

    &:hover {
      color: #fff;
      cursor: pointer;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    display: flex;
    list-style: none;
  }

  li {
    padding-right: 10%;
    display: flex;
  }
`

export const SuffixedInput = styled.section`
  input {
    width: 100%;
    border: 1px solid #3ede86;
    height: 2.4em;
    color: #fff;
    padding-left: 1em;
    border-radius: 1em;
    background-color: transparent;
  }

  svg {
    position: absolute;
    top: 1em;
  }
`

export const NavWrapper = styled.section`
  background-color: #154a39;
  color: #fff;
  height: 4em;
  display: flex;
  justify-content: center;
  align-items: center;

  > div {
    max-width: 1080px;
    width: 100%;
  }

  @media screen and (min-width: 755px) {
    img {
      width: 70%;
      max-height: 2.8em;
    }
  }

  @media screen and (max-width: 744px) {
    padding: 0 1em;

    img {
      width: 100%;
      max-height: 2.8em;
    }
  }

  aside {
    p {
      display: inline;
    }

    button {
      border: none;
    }
  }
`
