import { ReactNode, Suspense } from "react"
import { useMutation, useRouter, useSession, Link } from "blitz"
import logout from "app/auth/mutations/logout"
import { Avatar, Button, Row, Col, Input } from "antd"
import { AiOutlineMenu, AiOutlineUser, AiOutlineSearch } from "react-icons/ai"
import { WiDaySunny } from "react-icons/wi"
import * as styled from "app/layouts/components/styles"

export const NavBar = (props) => {
  const session = useSession()
  const [logoutMutation] = useMutation(logout)

  return (
    <styled.HeaderNav>
      {session.userId ? (
        <SignedNav session={session} logoutMutation={logoutMutation} />
      ) : (
        <UnSignedNav />
      )}
    </styled.HeaderNav>
  )
}

const UnSignedNav = () => (
  <Row justify="space-between" align="middle" style={{ height: "100%" }}>
    <Col xs={8} sm={6} md={4}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="Nexus Finance Logo" />
        </a>
      </Link>
    </Col>
    <Col xs={4} sm={0}>
      <Button ghost icon={<AiOutlineMenu />} />
    </Col>
    <Col xs={0} sm={12}>
      <ul>
        <li>
          <Link href="/about">
            <a>About</a>
          </Link>
        </li>
        <li>
          <Link href="/blog">
            <a>Blog</a>
          </Link>
        </li>
        <li>
          <Link href="/login">
            <a>Login</a>
          </Link>
        </li>
        <li>
          <Link href="/signup">
            <a>Sign Up</a>
          </Link>
        </li>
      </ul>
    </Col>
  </Row>
)

const SignedNav = ({ session, logoutMutation }) => (
  <Row justify="space-between" align="middle" style={{ height: "100%" }}>
    <Col xs={12} sm={8} md={4}>
      <Link href="/">
        <a>
          <img src="/logo.svg" alt="Nexus Finance Logo" />
        </a>
      </Link>
    </Col>
    <Col xs={4} sm={0}>
      <Button ghost icon={<AiOutlineMenu />} />
    </Col>
    <Col xs={0} sm={12}>
      <ul>
        <li>
          <Link href="/accounts">
            <a>Accounts</a>
          </Link>
        </li>
        <li>
          <Link href={`/users/${session.userId}`}>
            <a>Dashboard</a>
          </Link>
        </li>
        <li>
          {session.userId ? (
            <button
              onClick={async () => {
                await logoutMutation()
              }}
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <a>Login</a>
            </Link>
          )}
        </li>
      </ul>
    </Col>
  </Row>
)

export const DashboardNavBar = (props) => {
  return (
    <styled.NavWrapper>
      <Row justify="space-between">
        <Col xs={10} md={6}>
          <Link href="/">
            <a>
              <img src="/logo.svg" alt="Nexus Finance Logo" />
            </a>
          </Link>
        </Col>
        <Col xs={0} md={10}>
          <styled.SuffixedInput>
            <input placeholder="Search" />
          </styled.SuffixedInput>
        </Col>
        <Col xs={12} md={6}>
          <aside>
            <Row justify="center" align="middle">
              <Col xs={8} md={0}>
                <Button icon={<AiOutlineSearch />} ghost />
              </Col>
              <Col xs={0} md={8}>
                <p> Username </p>
              </Col>
              <Col xs={8}>
                <Avatar icon={<AiOutlineUser />} />
              </Col>
              <Col xs={4}>
                <Button ghost icon={<WiDaySunny size="24px" />} />
              </Col>
            </Row>
          </aside>
        </Col>
      </Row>
    </styled.NavWrapper>
  )
}
