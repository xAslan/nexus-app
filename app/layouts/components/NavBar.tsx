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
    </styled.HeaderNav>
  )
}

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
          <Input.Search placeholder="Search" />
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
                <Button ghost icon={<WiDaySunny />} />
              </Col>
            </Row>
          </aside>
        </Col>
      </Row>
    </styled.NavWrapper>
  )
}
