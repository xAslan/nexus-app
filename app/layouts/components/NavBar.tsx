import { ReactNode, Suspense } from "react"
import { useSession, Link, useMutation } from "blitz"
import logout from "app/auth/mutations/logout"

const NavBar = () => {
  const session = useSession()
  const [logoutMutation] = useMutation(logout)
  console.log(session)
  return (
    <div>
      <p>NavBar Links</p>
      <Link href="/">Home</Link>
      {session.userId ? (
        <button
          className="button small"
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
      ) : (
        <Link href="/login">
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      )}
    </div>
  )
}

export default NavBar
